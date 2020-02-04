// @flow strict

import {Sprite} from 'pixi.js';
import Body from '@core/physics/Body';
import Group from '@core/physics/Group';

import type {LayerProps} from '@layers';

const glowDistance = 10;

function createGems({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['gems'];

  if (layer.type === 'tileLayer') {
    throw Error('wrong type of layer');
  }

  let gems = new Group();

  layer.sprites.forEach(sprite => {
    const {id, position} = sprite;
    const gem = new Body(
      new Sprite(spriteset.spritesheet.getById(id)),
      [position[0] * spriteset.tilesize, position[1] * spriteset.tilesize],
      spriteset.tilesize
    );

    if (gems) {
      gems.add(gem);
    }
  });

  function cleanup() {
    gems = null;
  }

  return [gems, cleanup];
}

export default createGems;
