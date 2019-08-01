import Scene from './Scene';
import Sprite from './Sprite';

import {resolveBlocks} from '@utils/blocks';
import Keyboard from '@models/Keyboard';
import DynamicBody from '@physics/DynamicBody';
import Tile from '@physics/Tile';
import Tilemap from '@physics/Tilemap';

import Jump from '@traits/Jump';
import Move from '@traits/Move';

class Level extends Scene {
  constructor(global, data) {
    super('level', global, data);
  }

  create() {
    const playerTex = this.global.assets['player'].texture;
    const player = new DynamicBody(new Sprite(playerTex, 0, 0));
    const ground = new Tilemap(8, -4);

    player.addTrait(new Jump());
    player.addTrait(new Move());

    resolveBlocks('ground', this.data.tiles.ground, block => {
      const {texture} = this.global.assets[block.asset];
      ground.add(new Tile(new Sprite(texture, block.x, block.y)));
    });

    this.addBody(player);
    this.addTilemap(ground);
    // this.addGroup(enemies);

    this.physics.addDynamic(player);

    this.physics.gravity(player, ground, (force, body) => {
      body.gravity.apply(force.x, force.y);
      body.gravity.applyTo(body.velocity);
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

    console.log(this);
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
    this.physics.postUpdate(deltaTime);
  }
}

export default Level;
