// @flow strict

import Tileset from '@core/structure/Tileset';

import type {LayerProps} from '@layers';

function createBack({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['back'];

  if (layer.type === 'spriteLayer') {
    throw Error('wrong type of layer');
  }

  const {tilemap, width, offset} = layer;
  let back = new Tileset(tilemap, width, offset);

  back.loadSprites(spriteset.spritesheet);

  function cleanup() {
    back = null;
  }

  return [back, cleanup];
}

export default createBack;
