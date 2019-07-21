import engine from '@app/engine';
import loader from '@app/loader';
import renderGui from '@gui';

import Timer from '@models/Timer';
import Global from '@models/Global';
import Level from '@models/Level';

import data from '@levels/1-4.json';

const getNumberOfPrizes = global => {
  const {prizes} = global.level.layers;
  return prizes ? prizes.children.length : 0;
};

loader.load(() => {
  const {start, time, score, blank, landing} = renderGui();

  let level = null;
  let prizesLimit = 0;

  const timer = new Timer();
  const global = new Global({
    assets: loader.resources,
    engine
  });

  const {events} = global;

  events.onPlayerDead(() => {
    blank.classList.remove('hidden');

    setTimeout(() => {
      blank.classList.add('hidden');
      global.mount((level = new Level(data)));
    }, 700);
  });

  events.onMountLevel(() => {
    prizesLimit = getNumberOfPrizes(global);
    score.value = `score 0-${prizesLimit}`;
    timer.reset();
  });

  events.onScore(() => {
    const value = prizesLimit - getNumberOfPrizes(global);
    score.value = `score ${value}-${prizesLimit}`;

    if (value === prizesLimit) {
      console.log('level completed!');
      timer.stop();
    }
  });

  events.onStart(() => {
    level = new Level(data);
    global.mount(level);
    global.tick(deltaTime => {
      level.update(deltaTime);
      timer.update(deltaTime);

      if (timer.playing) {
        time.value = `time ${timer.toTime()}`;
      } else {
        time.value = `time ${timer.toPreciseTime()}`;
      }
    });
  });

  start.onClick = () => {
    landing.classList.add('hidden');
    blank.classList.remove('hidden');

    setTimeout(() => {
      blank.classList.add('hidden');
      events.publish('start');
    }, 1000);
  };
});
