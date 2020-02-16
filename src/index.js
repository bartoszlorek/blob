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
import levels from '@data/levels';

// gui
import Header from '@core/gui/Header';
import Footer from '@core/gui/Footer';
import PageRenderer from '@core/gui/PageRenderer';
import {LandingPage} from '@core/gui/pages';

const RESPAWN_TIME = 1000;
const SHOW_LEVEL_DELAY = 100;
const NEXT_LEVEL_DELAY = 1000;

const page = new PageRenderer('.page');
const header = new Header('.gui__header');
const footer = new Footer('.gui__footer');

loader.load((loader, resources) => {
  let spriteset = new Spriteset(levels.current, resources);
  const global = new Global(engine);

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

  page.render(
    new LandingPage({
      onStart: handleStart,
    })
  );

  global.events.on('player/dead', global => {
    global.enableDeadMode();
    global.stop();

    setFrameTimeout(() => {
      header.clearScore();
      global.disableDeadMode();
      global.load(new Level(global, spriteset));
      fadeInElement(global.engine.view);
    }, RESPAWN_TIME);
  });

  global.events.on('player/score', () => {
    header.incrementScore();

    if (header.isCompletedScore()) {
      if (levels.incrementLevel()) {
        header.timer.stop();

        setFrameTimeout(() => {
          spriteset = new Spriteset(levels.current, resources);
          header.render(spriteset);
          header.timer.start();

          global.load(new Level(global, spriteset));
          fadeInElement(global.engine.view);
        }, NEXT_LEVEL_DELAY);
      } else {
        header.timer.stop();
      }
    }
  });

  global.events.on('global/tick', deltaTime => {
    header.updateTimer(deltaTime);
  });
});
