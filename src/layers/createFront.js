// @flow strict

import Tileset from '@core/structure/Tileset';

import type {LayerProps} from '@layers';

function createFront({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['front'];

  if (layer.type === 'spriteLayer') {
    throw Error('wrong type of layer');
  }

  const {tilemap, width, offset} = layer;
  let front = new Tileset(tilemap, width, offset);

  front.loadSprites(spriteset.spritesheet);

  function cleanup() {
    front = null;
  }

  return [front, cleanup];
}

export default createFront;
