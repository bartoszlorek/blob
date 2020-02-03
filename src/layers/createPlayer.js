// @flow strict

import {Sprite} from 'pixi.js';
import Keyboard from '@core/Keyboard';
import Body from '@core/physics/Body';
import Jump from '@actions/Jump';
import Move from '@actions/Move';
import MouseMove from '@actions/MouseMove';

import type {LayerProps} from '@layers';

function createPlayer({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['player'];

  if (layer.type === 'tileLayer') {
    throw Error('wrong type of layer');
  }

  const {id, position} = layer.sprites[0]; // singleplayer

  let player = new Body(
    new Sprite(spriteset.spritesheet.getById(id)),
    position[0] * spriteset.tilesize,
    position[1] * spriteset.tilesize,
    spriteset.tilesize
  );

  player.addAction(new Jump());
  player.addAction(new Move());
  // player.addAction(new MouseMove(global));

  const input = new Keyboard();
  input.on('ArrowRight KeyD', pressed => {
    player && player.action['move'][pressed ? 'forward' : 'backward']();
  });

  input.on('ArrowLeft KeyA', pressed => {
    player && player.action['move'][pressed ? 'backward' : 'forward']();
  });

  input.on('Space', pressed => {
    player && player.action['jump'][pressed ? 'start' : 'cancel']();
  });

  function cleanup() {
    input.destroy();
    player = null;
  }

  return [player, cleanup];
}

export default createPlayer;
