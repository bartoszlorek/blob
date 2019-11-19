import Tileset from '@models/Tileset';

function createTiles({sheet, specs}) {
  const {tilemap, offset, width} = specs.tiles;
  const tiles = new Tileset(tilemap, width, offset);

  tiles.loadSprites(sheet);
  return [tiles];
}

export default createTiles;
