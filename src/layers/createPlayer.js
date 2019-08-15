import Keyboard from '@models/Keyboard';
import Sprite from '@models/Sprite';
import DynamicBody from '@physics/DynamicBody';

import Jump from '@traits/Jump';
import Move from '@traits/Move';

function createPlayer({data, global}) {
  const {texture} = global.assets['player'];
  const [x, y] = data.bodies.player;

  let player = new DynamicBody(new Sprite(texture, x, y));

  player.addTrait(new Jump());
  player.addTrait(new Move());

  const input = new Keyboard();
  input.on('ArrowRight KeyD', pressed => {
    player.move[pressed ? 'forward' : 'backward']();
  });

  input.on('ArrowLeft KeyA', pressed => {
    player.move[pressed ? 'backward' : 'forward']();
  });

  input.on('Space', pressed => {
    player.jump[pressed ? 'start' : 'cancel']();
  });

  function cleanup() {
    input.destroy();
    player = null;
  }

  return [player, cleanup];
}

export default createPlayer;
