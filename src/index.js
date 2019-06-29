import engine from './engine';
import loader from './loader';

import Creator from '@models/Creator';
import Helper from '@models/Helper';
import Global from '@models/Global';
import Level from '@models/Level';

import data from '@levels/1-4.json';

loader.load(() => {
  const global = new Global({
    assets: loader.resources,
    engine,
    size: 24
  });

  const helper = new Helper(global);
  const pointer = new Creator(global);
  const level = new Level(data);

  global.mount(level);
  global.tick(deltaTime => {
    level.update(deltaTime);

    // if (level.player) {
    //   const x = global.localToGrid(level.player.sprite.x);
    //   const y = global.localToGrid(level.player.sprite.y);

    //   helper.renderBox({
    //     x: global.gridToLocal(x),
    //     y: global.gridToLocal(y)
    //   });
    // }
    // helper.renderBounds(level.physics.bounds);
    // pointer.forEach(point => {
    //   helper.renderBox({
    //     x: global.gridToLocal(point.x),
    //     y: global.gridToLocal(point.y)
    //   });
    // });

    //
  });
});
