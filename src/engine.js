import PIXI, {Application} from 'pixi.js';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const engine = new Application({
  //transparent: true,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x5010a3,
  antialias: false,
});

// engine.ticker.maxFPS = 12;

// engine.view.className = 'view fade-steps';
document.body.appendChild(engine.view);

// export const fastFadeIn = callback => {
//   engine.view.classList.add('hidden');

//   setTimeout(() => {
//     engine.view.classList.remove('hidden');
//     callback();
//   }, 300);
// };

// export const slowFadeIn = callback => {
//   engine.view.classList.add('hidden');

//   setTimeout(() => {
//     engine.view.classList.remove('hidden');
//     callback();
//   }, 700);
// };

export default engine;
