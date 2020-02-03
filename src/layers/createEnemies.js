import {Sprite} from 'pixi.js';
import Group from '@core/physics/Group';
import Body from '@core/physics/Body';

import Watcher from '@actions/Watcher';

function createEnemies({global, spriteset}) {
  const {sprites} = spriteset.layers['enemies'];
  let enemies = new Group();

  sprites.forEach(sprite => {
    const {id, position} = sprite;
    const enemy = new Body(
      new Sprite(spriteset.spritesheet.getById(id)),
      position[0] * spriteset.tilesize,
      position[1] * spriteset.tilesize,
      spriteset.tilesize
    );

    enemy.addAction(new Watcher({scene, speed: 60}));
    enemies.add(enemy);
  });

  function cleanup() {
    enemies = null;
  }

  return [enemies, cleanup];
}

export default createEnemies;
