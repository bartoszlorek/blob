import engine, {fastFadeIn, slowFadeIn} from '@app/engine';
import loader from '@app/loader';
import renderGui from '@gui';

import Timer from '@models/Timer';
import Global from '@models/Global';
import Level from '@models/Level';

import dataLevel1 from '@levels/level-1.json';
import dataLevel0 from '@levels/level-0.json';

const levelData = [dataLevel0, dataLevel1];

const getNumberOfPrizes = levelIndex => {
  const {prizes} = levelData[levelIndex].static;
  return prizes ? prizes.length : 0;
};

loader.load(() => {
  const {start, time, score, landing} = renderGui();

  let prizesValue = 0;
  let prizesLimit = 0;
  let currentLevel = 1;

  const timer = new Timer();
  const global = new Global({
    assets: loader.resources,
    engine
  });

  const {events} = global;

  events.subscribe('player_dead', () => {
    slowFadeIn(() => {
      global.load(new Level(global, levelData[currentLevel]));
    });
  });

  events.subscribe('load_scene', () => {
    prizesValue = 0;
    prizesLimit = getNumberOfPrizes(currentLevel);
    score.value = `score ${prizesValue}-${prizesLimit}`;
    timer.reset();
  });

  events.subscribe('scene_completed', () => {
    if (++currentLevel < levelData.length) {
      fastFadeIn(() => {
        global.load(new Level(global, levelData[currentLevel]));
      });
    } else {
      timer.stop();
    }
  });

  events.subscribe('score', () => {
    prizesValue += 1;
    score.value = `score ${prizesValue}-${prizesLimit}`;

    if (prizesValue === prizesLimit) {
      events.publish('scene_completed');
    }
  });

  events.subscribe('start', () => {
    global.load(new Level(global, levelData[currentLevel]));
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
    fastFadeIn(() => events.publish('start'));
    start.onClick = null; // unbind
  };
});
