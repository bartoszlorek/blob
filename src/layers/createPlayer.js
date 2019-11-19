import {Sprite} from 'pixi.js';
import {baseSize} from '@app/consts';
import Keyboard from '@models/Keyboard';
import Body from '@physics/Body';

import Jump from '@traits/Jump';
import Move from '@traits/Move';

function createPlayer({sheet, specs}) {
  const {id, position} = specs.sprites.player;
  const [x, y] = position[0];

  const sprite = new Sprite(sheet.getById(id));
  sprite.position.x = x * baseSize;
  sprite.position.y = y * baseSize;

  let player = new Body(sprite);
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
