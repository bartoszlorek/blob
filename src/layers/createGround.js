import Tileset from '@core/structure/Tileset';

function createGround({spriteset}) {
  const {tilemap, width, offset} = spriteset.layers['ground'];
  const ground = new Tileset(tilemap, width, offset);

  ground.loadSprites(spriteset.spritesheet);
  return [ground];
}

export default createGround;
