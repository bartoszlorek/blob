import Scene from './Scene';
import Sprite from './Sprite';

import Tile from '@physics/Tile';
import Tilemap from '@physics/Tilemap';
import Body from '@physics/Body';

const groundSet = [[-1, 1], [0, 1], [1, 1]];

class Level extends Scene {
  constructor(global) {
    super('level', global);
  }

  create() {
    const groundTex = this.global.assets['ground_01'].texture;
    const playerTex = this.global.assets['player'].texture;

    const ground = new Tilemap(3, -1);
    const player = new Body(new Sprite(playerTex, 0, 0));

    groundSet.forEach(([x, y]) => {
      ground.add(Tile.from(new Sprite(groundTex, x, y)));
    });

    this.add('player', player);
    this.add('ground', ground);

    this.physics.collide(playerBody, ground);

    console.log(this);
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
  }
}

export default Level;
