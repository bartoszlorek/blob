import {Sprite} from 'pixi.js';
import {arrayForEach} from '@utils/array';
import Group from '@core/structure/Group';
import Body from '@core/physics/Body';

import Watcher from '@actions/Watcher';

function createEnemies({data, global, scene}) {
  let {texture} = global.assets['enemies'];
  let enemies = new Group();

  if (data.bodies.enemies) {
    arrayForEach(data.bodies.enemies, ([x, y]) => {
      const enemy = new Body(new Sprite(texture, x, y));
      enemy.addAction(new Watcher({scene, speed: 60}));
      enemies.add(enemy);
    });
  } else {
    enemies = null;
  }

  function cleanup() {
    texture = null;
    enemies = null;
  }

  return [enemies, cleanup];
}

export default createEnemies;
