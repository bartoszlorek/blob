// @flow strict

import {Sprite} from 'pixi.js';
import Group from '@core/physics/Group';
import Body from '@core/physics/Body';
import Explosive from '@actions/Explosive';

import type {LayerProps} from '@layers';

function createMines({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['mines'];

  if (layer.type === 'tileLayer') {
    throw Error('wrong type of layer');
  }

  let mines = new Group();

  layer.sprites.forEach(sprite => {
    const {id, position} = sprite;
    const mine = new Body(
      new Sprite(spriteset.spritesheet.getById(id)),
      position[0] * spriteset.tilesize,
      position[1] * spriteset.tilesize,
      spriteset.tilesize
    );

    mine.addAction(new Explosive(global));

    if (mines) {
      mines.add(mine);
    }
  });

  function cleanup() {
    mines = null;
  }

  return [mines, cleanup];
}

export default createMines;
