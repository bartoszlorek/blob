// @flow strict

import engine from '@app/engine';
import loader from '@app/loader';
import {fadeIn} from '@utils/dom';

// core
import Global from '@core/Global';
import Level from '@core/Level';
import Spriteset from '@core/structure/Spriteset';

// data
import level01 from '@data/level-01.json';

// gui
import PageRenderer from '@core/gui/PageRenderer';
import {LandingPage} from '@core/gui/pages';

const page = new PageRenderer('.page');

loader.load((loader, resources) => {
  const global = new Global(engine);
  const spriteset = new Spriteset(level01, resources);
  const level = new Level(global, spriteset);

  function handleStartClick() {
    page.unmount(() => {
      global.load(level);
      fadeIn(global.engine.view);
    });
  }

  page.render(
    new LandingPage({
      onClick: handleStartClick,
    })
  );
});
