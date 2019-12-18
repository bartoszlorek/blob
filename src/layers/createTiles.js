import Tileset from '@core/Tileset';

function createTiles({sheet, specs}) {
  const {tilemap, width, offset} = specs.tiles;
  const tiles = new Tileset(tilemap, width, offset);

  tiles.loadSprites(sheet);
  return [tiles];
}

export default createTiles;
