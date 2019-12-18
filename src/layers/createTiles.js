import Tileset from '@core/Tileset';

function createTiles({sheet, data}) {
  const {tilemap, width, offset} = data.tiles;
  const tiles = new Tileset(tilemap, width, offset);

  tiles.loadSprites(sheet);
  return [tiles];
}

export default createTiles;
