import Sprite from '@models/Sprite';
import Group from '@models/Group';
import DynamicBody from '@physics/DynamicBody';

import Watcher from '@traits/Watcher';

function createEnemies({data, global}) {
  let {texture} = global.assets['enemies'];
  let enemies = new Group();

  data.bodies.enemies.forEach(([x, y]) => {
    const enemy = new DynamicBody(new Sprite(texture, x, y));

    // enemy.addTrait(new Watcher({global, scene, speed: 60}));
    enemies.add(enemy);
  });

  function cleanup() {
    texture = null;
    enemies = null;
  }

  return [enemies, cleanup];
}

export default createEnemies;
