import {Application} from 'pixi.js';

const engine = new Application({
  //transparent: true,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x01024e
});

engine.view.className = 'view';
document.body.appendChild(engine.view);
export default engine;
