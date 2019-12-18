import {Sprite} from 'pixi.js';
import {baseSize} from '@app/consts';
import Keyboard from '@models/Keyboard';
import Body from '@physics/core/Body';

import Jump from '@traits/Jump';
import Move from '@traits/Move';
import MouseMove from '@traits/MouseMove';

function createPlayer({sheet, specs, global}) {
  const {id, position} = specs.sprites.player;
  const [x, y] = position[0];

  let player = new Body(
    new Sprite(sheet.getById(id)),
    x * baseSize,
    y * baseSize,
    baseSize
  );

  player.addTrait(new Jump());
  player.addTrait(new Move());
  // player.addTrait(new MouseMove(global));

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
