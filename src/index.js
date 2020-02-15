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
import Footer from '@core/gui/Footer';
import PageRenderer from '@core/gui/PageRenderer';
import {LandingPage} from '@core/gui/pages';

const page = new PageRenderer('.page');
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

    footer.render();
    page.unmount(() => {
      global.load(new Level(global, spriteset));

      setFrameTimeout(() => {
        showElement(view);
        fadeInElement(view);
      }, 100);
    });
  }

  global.events.on('player/dead', global => {
    global.enableDeadMode();
    global.stop();

    setFrameTimeout(() => {
      global.disableDeadMode();
      global.load(new Level(global, spriteset));
      fadeInElement(global.engine.view);
    }, 500);
  });

  global.events.on('player/score', () => {
    console.log('score');
  });
});
