import Tileset from '@core/structure/Tileset';

function createBack({global, spriteset}) {
  const {tilemap, width, offset} = spriteset.layers['back'];
  const back = new Tileset(tilemap, width, offset);

  back.loadSprites(spriteset.spritesheet);
  return [back];
}

export default createBack;
