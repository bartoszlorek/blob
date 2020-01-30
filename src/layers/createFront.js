import Tileset from '@core/structure/Tileset';

function createFront({global, spriteset}) {
  const {tilemap, width, offset} = spriteset.layers['front'];
  const front = new Tileset(tilemap, width, offset);

  front.loadSprites(spriteset.spritesheet);
  return [front];
}

export default createFront;
