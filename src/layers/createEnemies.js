import Sprite from '@models/Sprite';
import Group from '@models/Group';
import DynamicBody from '@physics/DynamicBody';

import Watcher from '@traits/Watcher';

function createEnemies(global, data) {
  const {texture} = global.assets['enemies'];
  const enemies = new Group();

  data.bodies.enemies.forEach(([x, y]) => {
    const body = new DynamicBody(new Sprite(texture, x, y));

    // body.addTrait(new Watcher({global, scene, speed: 60}));
    enemies.add(body);
  });

  return enemies;
}

export default createEnemies;
