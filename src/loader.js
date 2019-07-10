import {Loader} from 'pixi.js';

const loader = new Loader();

loader.add([
  // graphics
  {name: 'gradient', url: 'assets/gradient.png'},
  {name: 'player', url: 'assets/player.png'},
  {name: 'prizes', url: 'assets/prizes.png'},
  {name: 'mines', url: 'assets/mines.png'},
  {name: 'blast', url: 'assets/blast.png'},
  {name: 'ground_01', url: 'assets/ground_01.png'},
  {name: 'ground_02', url: 'assets/ground_02.png'},
  {name: 'ground_03', url: 'assets/ground_03.png'},
  {name: 'ground_04', url: 'assets/ground_04.png'},
  {name: 'ground_05', url: 'assets/ground_05.png'},
  {name: 'ground_06', url: 'assets/ground_06.png'},
  {name: 'ground_07', url: 'assets/ground_07.png'},
  {name: 'ground_08', url: 'assets/ground_08.png'},
  {name: 'ground_09', url: 'assets/ground_09.png'},
  {name: 'ground_10', url: 'assets/ground_10.png'},
  {name: 'ground_11', url: 'assets/ground_11.png'},
  {name: 'ground_12', url: 'assets/ground_12.png'},
  {name: 'ground_13', url: 'assets/ground_13.png'},
  {name: 'enemies', url: 'assets/enemies.png'},
  {name: 'cave', url: 'assets/cave.png'},

  // sounds
  {name: 'jump_01', url: 'assets/jump_01.mp3'},
  {name: 'jump_02', url: 'assets/jump_02.mp3'},
  {name: 'jump_03', url: 'assets/jump_03.mp3'},
  {name: 'jump_04', url: 'assets/jump_04.mp3'}
]);

loader.on('complete', (loader, assets) => {
  assets['jump_01'].data.volume = 0.2;
  assets['jump_02'].data.volume = 0.2;
  assets['jump_03'].data.volume = 0.2;
  assets['jump_04'].data.volume = 0.2;
});

export default loader;
