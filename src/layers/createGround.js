// @flow strict

import Tileset from '@core/structure/Tileset';

import type {LayerProps} from '@layers';

function createGround({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['ground'];

  if (layer.type === 'spriteLayer') {
    throw Error('wrong type of layer');
  }

  const {tilemap, width, offset} = layer;
  const ground = new Tileset(tilemap, width, offset);

  ground.loadSprites(spriteset.spritesheet);
  return [ground];
}

export default createGround;
