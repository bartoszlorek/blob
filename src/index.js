import engine from '@app/engine';
import loader from '@app/loader';
import renderGui from '@gui';

import Timer from '@models/Timer';
import Global from '@models/Global';
import Level from '@scenes/Level';
import Intro from '@scenes/Intro';

import data from '@levels/1-4.json';

const getNumberOfPrizes = global => {
  const {prizes} = global.scenes[0].layers;
  return prizes ? prizes.children.length : 0;
};

loader.load(() => {
  const {start, time, score, blank, landing} = renderGui();

  let prizesLimit = 0;

  const timer = new Timer();
  const global = new Global({
    assets: loader.resources,
    engine
  });

  const {events} = global;

  events.subscribe('player_dead', () => {
    blank.classList.remove('hidden');

    setTimeout(() => {
      blank.classList.add('hidden');
      global.replaceScene(0, new Level(data, global));
    }, 700);
  });

  events.subscribe('add_scene', () => {
    prizesLimit = getNumberOfPrizes(global);
    score.value = `score 0-${prizesLimit}`;
    timer.reset();
  });

  events.subscribe('score', () => {
    const value = prizesLimit - getNumberOfPrizes(global);
    score.value = `score ${value}-${prizesLimit}`;

    if (value === prizesLimit) {
      console.log('level completed!');
      timer.stop();
    }
  });

  events.subscribe('start', () => {
    global.tick(deltaTime => {
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
    global.addScene(new Intro(global));

    // blank.classList.remove('hidden');

    setTimeout(() => {
      global.replaceScene(0, new Level(data, global));

      // blank.classList.add('hidden');
      events.publish('start');
    }, 1000);
  };
});
