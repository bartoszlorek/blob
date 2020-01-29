import {Sprite} from 'pixi.js';
import {baseSize} from '@app/constants';
import Keyboard from '@core/Keyboard';
import Body from '@core/physics/Body';

import Jump from '@actions/Jump';
import Move from '@actions/Move';
import MouseMove from '@actions/MouseMove';

function createPlayer({global, spriteset}) {
  const {sprites} = spriteset.layers['player'];
  const {id, position} = sprites[0];

  let player = new Body(
    new Sprite(spriteset.spritesheet.getById(id)),
    position[0] * baseSize,
    position[1] * baseSize,
    baseSize
  );

  player.addAction(new Jump());
  player.addAction(new Move());
  // player.addAction(new MouseMove(global));

  const input = new Keyboard();
  input.on('ArrowRight KeyD', pressed => {
    player.action['move'][pressed ? 'forward' : 'backward']();
  });

  input.on('ArrowLeft KeyA', pressed => {
    player.action['move'][pressed ? 'backward' : 'forward']();
  });

  input.on('Space', pressed => {
    player.action['jump'][pressed ? 'start' : 'cancel']();
  });

  function cleanup() {
    input.destroy();
    player = null;
  }

  return [player, cleanup];
}

export default createPlayer;
