// @flow strict

import './scss/main.scss';
import {fadeInElement, showElement, hideElement} from '@utils/dom';
import {setFrameTimeout} from '@utils/raf';
import engine from '@app/engine';
import loader from '@app/loader';

// core
import Global from '@core/Global';
import Level from '@core/Level';
import Spriteset from '@core/structure/Spriteset';

// data
import level01 from '@data/level-01.json';

// gui
import Header from '@core/gui/Header';
import Footer from '@core/gui/Footer';
import PageRenderer from '@core/gui/PageRenderer';
import {LandingPage} from '@core/gui/pages';

const RESPAWN_TIME = 1000;
const SHOW_LEVEL_DELAY = 100;

const page = new PageRenderer('.page');
const header = new Header('.gui__header');
const footer = new Footer('.gui__footer');

loader.load((loader, resources) => {
  const global = new Global(engine);
  const spriteset = new Spriteset(level01, resources);

  page.render(
    new LandingPage({
      onStart: handleStart,
    })
  );

  function handleStart() {
    const {view} = global.engine;
    hideElement(view);

    header.render(spriteset);
    footer.render();
    page.unmount(() => {
      global.load(new Level(global, spriteset));

      setFrameTimeout(() => {
        showElement(view);
        fadeInElement(view);
      }, SHOW_LEVEL_DELAY);
    });
  }

  global.events.on('player/dead', global => {
    global.enableDeadMode();
    global.stop();

    setFrameTimeout(() => {
      header.timer.reset();
      header.clearScore();

      global.disableDeadMode();
      global.load(new Level(global, spriteset));
      fadeInElement(global.engine.view);
    }, RESPAWN_TIME);
  });

  global.events.on('player/score', () => {
    header.incrementScore();

    if (header.isCompletedScore()) {
      header.timer.stop();
      global.stop();
    }
  });

  global.events.on('global/tick', deltaTime => {
    header.updateTimer(deltaTime);
  });
});
