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

const getNumberOfPrizes = global => {
  const {prizes} = global.level.layers;
  return prizes ? prizes.children.length : 0;
};

loader.load(() => {
  const {time, score} = renderGui();

  let level = null;
  let prizesLimit = 0;

  const timer = new Timer();
  const global = new Global({
    assets: loader.resources,
    engine
  });

  engine.view.classList.add('view--active');

  global.events.onPlayerDead(() => {
    engine.view.classList.remove('view--active');

    setTimeout(() => {
      engine.view.classList.add('view--active');
      global.mount((level = new Level(data)));
      timer.reset();
    }, 700);
  });

  global.events.onMountLevel(() => {
    prizesLimit = getNumberOfPrizes(global);
    score.value = `score 0-${prizesLimit}`;
  });

  global.events.onScore(() => {
    const value = prizesLimit - getNumberOfPrizes(global);
    score.value = `score ${value}-${prizesLimit}`;

    if (value === prizesLimit) {
      console.log('level up!');
      timer.stop();
    }
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
