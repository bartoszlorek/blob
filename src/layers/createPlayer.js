// @flow strict

import AnimatedSprite from '@core/AnimatedSprite';
import Keyboard from '@core/Keyboard';
import Body from '@core/physics/Body';
import Jump from '@traits/Jump';
import Move from '@traits/Move';
import MouseMove from '@traits/MouseMove';

import type {KeyframesType} from '@core/Animation';
import type {LayerProps} from '@layers';

// todo: get firstgid from tilesets
const keyframes: KeyframesType = {
  idle: {
    frame: 0,
    firstId: 257 + 0,
    lastId: 257 + 7,
  },
  run: {
    frame: 0,
    firstId: 257 + 10,
    lastId: 257 + 17,
  },
};

function createPlayer({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['player'];

  if (layer.type === 'tileLayer') {
    throw Error('wrong type of layer');
  }

  const {id, position} = layer.sprites[0]; // singleplayer

  let player = new Body(
    new AnimatedSprite(spriteset.spritesheet.getById(id)),
    [position[0] * spriteset.tilesize, position[1] * spriteset.tilesize],
    spriteset.tilesize / 2
  );

  player.sprite.animation.keyframes = keyframes;
  player.addTrait(new Jump());
  player.addTrait(new Move());
  // player.addTrait(new MouseMove(global));

  const input = new Keyboard();
  input.on('ArrowRight KeyD', pressed => {
    player && player.trait['move'][pressed ? 'forward' : 'backward']();
  });

  input.on('ArrowLeft KeyA', pressed => {
    player && player.trait['move'][pressed ? 'backward' : 'forward']();
  });

  input.on('Space', pressed => {
    player && player.trait['jump'][pressed ? 'start' : 'cancel']();
  });

  function cleanup() {
    input.destroy();
    player = null;
  }

  return [player, cleanup];
}

export default createPlayer;
