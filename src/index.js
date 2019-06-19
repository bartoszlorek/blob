import app from './app';
import loader from './loader';
import state from '@state/store';

import Helper from '@models/Helper';
import Global from '@models/Global';
import Level from '@models/Level';
import data from '@levels/1-1.json';

loader.load((loader, assets) => {
  const global = new Global(app, state, 24);
  const level = new Level(data);
  const helper = new Helper(global);

  global.load(level);

  app.ticker.add(deltaFrame => {
    const deltaTime = global.time * deltaFrame;

    level.update(deltaTime);
    level.render(global);

    const {pos} = level.layers.player.head;
    helper.renderBounds(level.physics.bounds);
    helper.renderBox({
      x: global.gridToLocal(global.localToGrid(pos.x)),
      y: global.gridToLocal(global.localToGrid(pos.y))
    });
  });
});
