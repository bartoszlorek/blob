import {localToGrid, gridToLocal} from '@app/consts';
import engine from '@app/engine';
import loader from '@app/loader';
import renderGui from '@gui';

import Timer from '@models/Timer';
import Creator from '@models/Creator';
import Helper from '@models/Helper';
import Global from '@models/Global';
import Level from '@models/Level';

import data from '@levels/1-4.json';

loader.load(() => {
  const {time, score} = renderGui();

  let level = null;

  const timer = new Timer();
  const global = new Global({
    assets: loader.resources,
    engine
  });

  engine.view.classList.add('view--active');

  global.events.onPlayerDead(() => {
    engine.view.classList.remove('view--active');

    setTimeout(() => {
      score.value = 'score 0-0';
      engine.view.classList.add('view--active');
      global.mount((level = new Level(data)));
    }, 700);
  });

  // const helper = new Helper(global);
  // const pointer = new Creator(global);
  level = new Level(data);

  global.mount(level);
  global.tick(deltaTime => {
    timer.update(deltaTime);
    time.value = `time ${timer.toTime()}`;

    level.update(deltaTime);

    // if (level.player) {
    //   helper.renderBox({
    //     x: gridToLocal(localToGrid(level.player.sprite.x)),
    //     y: gridToLocal(localToGrid(level.player.sprite.y))
    //   });
    // }
    // helper.renderBounds(level.physics.bounds);
    // pointer.forEach(point => {
    //   helper.renderBox({
    //     x: gridToLocal(point.x),
    //     y: gridToLocal(point.y)
    //   });
    // });

    //
  });
});
