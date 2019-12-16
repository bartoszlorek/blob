import {arrayForEach} from '@utils/array';
import Sprite from '@models/Sprite';
import Group from '@models/Group';
import Body from '@physics/core/Body';

import Watcher from '@traits/Watcher';

function createEnemies({data, global, scene}) {
  let {texture} = global.assets['enemies'];
  let enemies = new Group();

  if (data.bodies.enemies) {
    arrayForEach(data.bodies.enemies, ([x, y]) => {
      const enemy = new Body(new Sprite(texture, x, y));
      enemy.addTrait(new Watcher({scene, speed: 60}));
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
