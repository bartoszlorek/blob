import app from './app';
import loader from './loader';

import Helper from '@models/Helper';
import Global from '@models/Global';
import Level from '@models/Level';
import data from '@levels/1-1.json';

loader.load(() => {
  const global = new Global(app, 24);
  const helper = new Helper(global);

  const level = new Level(data);
  global.load(level);

  global.tick(deltaTime => {
    level.update(deltaTime);
    level.render(global);

    // const {pos} = level.layers.player.head;
    // helper.renderBounds(level.physics.bounds);
    // helper.renderBox({
    //   x: global.gridToLocal(global.localToGrid(pos.x)),
    //   y: global.gridToLocal(global.localToGrid(pos.y))
    // });
  });
});
