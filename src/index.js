import engine, {fastFadeIn, slowFadeIn} from '@app/engine';
import loader from '@app/loader';
import renderGui from '@gui';

import Timer from '@models/Timer';
import Global from '@models/Global';
import Level from '@models/Level';

import dataLevel1 from '@levels/level-1.json';
import dataLevel0 from '@levels/level-0.json';

const getNumberOfPrizes = global => {
  const {prizes} = global.level.layers;
  return prizes ? prizes.children.length : 0;
};

loader.load(() => {
  const {start, time, score, landing} = renderGui();

  let prizesLimit = 0;
  let currentLevel = 0;

  const timer = new Timer();
  const global = new Global({
    assets: loader.resources,
    engine
  });

  const {events} = global;

  // events.subscribe('player_dead', () => {
  //   slowFadeIn(() => {
  //     global.load(new Level(dataLevel1));
  //   });
  // });

  // events.subscribe('load_level', () => {
  //   prizesLimit = getNumberOfPrizes(global);
  //   score.value = `score 0-${prizesLimit}`;
  //   timer.reset();
  // });

  // events.subscribe('level_completed', () => {
  //   if (currentLevel === 0) {
  //     fastFadeIn(() => {
  //       global.load(new Level(dataLevel1));
  //       currentLevel++;
  //     });
  //   }
  //   if (currentLevel === 1) {
  //     timer.stop();
  //   }
  // });

  // events.subscribe('score', () => {
  //   const value = prizesLimit - getNumberOfPrizes(global);
  //   score.value = `score ${value}-${prizesLimit}`;

  //   if (value === prizesLimit) {
  //     events.publish('level_completed');
  //   }
  // });

  events.subscribe('start', () => {
    const level = new Level(global);

    level.create();

    engine.stage.addChild(level.graphics);
    engine.ticker.start();

    global.tick(deltaTime => {
      level.update(deltaTime);
    });
  });

  start.onClick = () => {
    landing.classList.add('hidden');
    fastFadeIn(() => events.publish('start'));
  };
});
