import {vectorRotation} from '@utils/physics';
import {resolveBlocks} from '@utils/blocks';

import Scene from '@models/Scene';
import Sprite from '@models/Sprite';
import Tile from '@models/Tile';
import Tilemap from '@models/Tilemap';
import Keyboard from '@models/Keyboard';
import DynamicBody from '@physics/DynamicBody';

import Jump from '@traits/Jump';
import Move from '@traits/Move';

class Level extends Scene {
  constructor(global, data) {
    super('level', global, data);
  }

  create() {
    const {assets} = this.global;
    const {
      background: bgData,
      bodies: {player: playerData}
    } = this.data;

    this.background.set(assets[bgData.texture].texture, bgData.breakpoints);

    const playerTex = assets['player'].texture;
    const player = new DynamicBody(
      new Sprite(playerTex, playerData[0], playerData[1])
    );

    player.addTrait(new Jump());
    player.addTrait(new Move());

    this.refs.player = player;

    const ground = new Tilemap();

    resolveBlocks('ground', this.data.tiles.ground, block => {
      const {texture} = assets[block.asset];
      ground.add(new Tile(new Sprite(texture, block.x, block.y)));
    });

    this.addTilemap(ground);
    this.addBody(player);
    // this.addGroup(enemies);

    this.physics.addDynamic(player);

    this.physics.gravity(player, ground, body => {
      body.gravity.applyTo(body.velocity);
      body.sprite.rotation = vectorRotation(body.gravity);
    });

    this.physics.collide(player, ground, (edge, body, tiles) => {
      body.jump.collide(edge, body, tiles);
      body.move.collide(edge, body, tiles);
    });

    const input = new Keyboard();
    input.on('ArrowRight KeyD', pressed => {
      player.move[pressed ? 'forward' : 'backward']();
    });

    input.on('ArrowLeft KeyA', pressed => {
      player.move[pressed ? 'backward' : 'forward']();
    });

    input.on('Space', pressed => {
      player.jump[pressed ? 'start' : 'cancel']();
    });

    this.resize();
    this.focus(player);
    console.log(this);
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
    this.follow(this.refs.player);
  }
}

export default Level;
