import Tileset from '@models/Tileset';

function createTiles({sheet, specs}) {
  const {tilemap, offset, width} = specs.tiles;
  const tiles = new Tileset(tilemap, offset, width);

  tiles.loadSprites(sheet);
  return [tiles];
}

export default createTiles;
