import Scene from './Scene';
import Sprite from './Sprite';

import Tile from '@physics/Tile';
import Tilemap from '@physics/Tilemap';
import DynamicBody from '@physics/DynamicBody';

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

    groundSet.forEach(([x, y]) => {
      ground.add(new Tile(new Sprite(groundTex, x, y)));
    });

    this.addBody(player);
    this.addTilemap(ground);
    // this.addGroup(enemies);

    this.physics.addDynamic(player);
    // this.physics.collide(player, ground);
    // this.physics.gravity(player, ground);
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
  }
}

export default Level;
