import createCave from './createCave';
import createEffects from './createEffects';
import createEnemies from './createEnemies';
import createGround from './createGround';
import createMines from './createMines';
import createPlayer from './createPlayer';
import createPrizes from './createPrizes';

export default {
  ground: createGround,
  cave: createCave,
  mines: createMines,
  enemies: createEnemies,
  prizes: createPrizes,
  effects: createEffects,
  player: createPlayer
};
