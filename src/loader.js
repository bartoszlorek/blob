import {Loader} from 'pixi.js';

const loader = new Loader();

loader.add([
  // graphics
  {name: 'blast', url: 'assets/blast.png'},
  {name: 'gradient', url: 'assets/gradient.png'},
  {name: 'ground', url: 'assets/ground.png'},
  {name: 'mines', url: 'assets/mines.png'},
  {name: 'player', url: 'assets/player.png'},
  {name: 'prizes', url: 'assets/prizes.png'},

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
