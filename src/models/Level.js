import Scene from './Scene';
import Sprite from './Sprite';

import Keyboard from '@models/Keyboard';
import Tile from '@physics/Tile';
import Tilemap from '@physics/Tilemap';
import DynamicBody from '@physics/DynamicBody';

import Jump from '@traits/Jump';
import Move from '@traits/Move';

const groundSet = [[-1, 1], [0, 1], [1, 1]];

class Level extends Scene {
  constructor(global) {
    super('level', global);
  }

  create() {
    const groundTex = this.global.assets['ground_01'].texture;
    const playerTex = this.global.assets['player'].texture;

    const ground = new Tilemap(3, -1);
    const player = new DynamicBody(new Sprite(playerTex, 0, 0));

    player.addTrait(new Jump());
    player.addTrait(new Move());

    groundSet.forEach(([x, y]) => {
      ground.add(new Tile(new Sprite(groundTex, x, y)));
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
    this.physics.postUpdate();
  }
}

export default Level;
