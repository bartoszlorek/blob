import app from './app';
import loader from './loader';

import Creator from '@models/Creator';
import Helper from '@models/Helper';
import Global from '@models/Global';
import Level from '@models/Level';

import data from '@levels/1-4.json';

loader.load(() => {
  const global = new Global({app, size: 24});
  const helper = new Helper(global);
  const pointer = new Creator(global);
  const level = new Level(data);

  global.load(level);
  helper.enabled = false;

  global.tick(deltaTime => {
    level.update(deltaTime);
    level.render(global);

    const {head} = level.layers.player;
    if (head) {
      helper.renderBox({
        x: global.gridToLocal(global.localToGrid(head.pos.x)),
        y: global.gridToLocal(global.localToGrid(head.pos.y))
      });
    }
    helper.renderBounds(level.physics.bounds);
    pointer.forEach(point => {
      helper.renderBox({
        x: global.gridToLocal(point.x),
        y: global.gridToLocal(point.y)
      });
    });
  });
});
