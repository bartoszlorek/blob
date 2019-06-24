import {Application} from 'pixi.js';

const app = new Application({
  //antialias: true,
  //transparent: true,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x160644
});

document.body.appendChild(app.view);
export default app;
