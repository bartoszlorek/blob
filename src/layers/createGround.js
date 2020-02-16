// @flow strict

import Tileset from '@core/structure/Tileset';

import type {LayerProps} from '@layers';

function createGround({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['ground'];

  if (layer.type === 'spriteLayer') {
    throw Error('wrong type of layer');
  }

  const {tilemap, width, offset} = layer;
  let ground = new Tileset(tilemap, width, offset);

  ground.loadSprites(spriteset.spritesheet);

  function cleanup() {
    ground = null;
  }

  return [ground, cleanup];
}

export default createGround;
