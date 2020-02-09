// @flow strict

import PIXI, {Application} from 'pixi.js';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const engine = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x03065c,
  antialias: false,
});

engine.view.className = 'view';

if (document.body) {
  document.body.appendChild(engine.view);
}

export default engine;
