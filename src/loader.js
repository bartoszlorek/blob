import {Loader} from 'pixi.js';

const loader = new Loader();

loader.add([
  // graphics
  {name: 'gradient', url: 'assets/gradient.png'},

  // sounds
  //{ name: 'pluck', url: 'assets/pluck.mp3' },
  //{ name: 'jump', url: 'assets/jump.mp3' },
  {name: 'pluck', url: 'assets/synth_pluck.mp3'},
  {name: 'jump', url: 'assets/synth_jump.mp3'}
]);

loader.on('complete', (loader, assets) => {
  assets.pluck.data.volume = 0.04;
  assets.jump.data.volume = 0.15;
});

export default loader;
