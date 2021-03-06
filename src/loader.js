// @flow strict

import {Loader} from 'pixi.js';

const loader = new Loader();

loader.add([
  // graphics
  {name: 'background', url: 'assets/background.png'},
  {name: 'characters', url: 'assets/characters.png'},
  {name: 'vfx', url: 'assets/vfx.png'},
  {name: 'world', url: 'assets/world.png'},

  // sounds
  {name: 'jump_01', url: 'assets/jump_01.mp3'},
  {name: 'jump_02', url: 'assets/jump_02.mp3'},
  {name: 'jump_03', url: 'assets/jump_03.mp3'},
  {name: 'jump_04', url: 'assets/jump_04.mp3'},
]);

loader.on('complete', (loader, assets) => {
  assets['jump_01'].data.volume = 0.1;
  assets['jump_02'].data.volume = 0.1;
  assets['jump_03'].data.volume = 0.1;
  assets['jump_04'].data.volume = 0.1;
});

export default loader;
