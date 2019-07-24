import {Application} from 'pixi.js';

const engine = new Application({
  //transparent: true,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x01024e
});

engine.view.className = 'view fade-steps';
document.body.appendChild(engine.view);

export const fastFadeIn = callback => {
  engine.view.classList.add('hidden');

  setTimeout(() => {
    engine.view.classList.remove('hidden');
    callback();
  }, 300);
};

export const slowFadeIn = callback => {
  engine.view.classList.add('hidden');

  setTimeout(() => {
    engine.view.classList.remove('hidden');
    callback();
  }, 700);
};

export default engine;
