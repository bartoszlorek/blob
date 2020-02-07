// @flow strict

import Tileset from '@core/structure/Tileset';

import type {LayerProps} from '@layers';

function createFront({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['front'];

  if (layer.type === 'spriteLayer') {
    throw Error('wrong type of layer');
  }

  const {tilemap, width, offset} = layer;
  const front = new Tileset(tilemap, width, offset);

  front.loadSprites(spriteset.spritesheet);
  return [front];
}

export default createFront;
