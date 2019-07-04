import {Application} from 'pixi.js';

const engine = new Application({
  //antialias: true,
  //transparent: true,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x160644
});

document.body.appendChild(engine.view);
export default engine;