import {resolveTiles} from '@utils/tiles';
import Sprite from '@core/Sprite';
import Tile from '@core/Tile';
import Tilemap from '@core/Tilemap';

function createCave({data, global}) {
  let cave = new Tilemap();

  if (data.tiles.cave) {
    resolveTiles('cave', data.tiles.cave, tile => {
      const {texture} = global.assets[tile.asset];
      cave.add(new Tile(new Sprite(texture, tile.x, tile.y)));
    });
  } else {
    cave = null;
  }

  function cleanup() {
    cave = null;
  }

  return [cave, cleanup];
}

export default createCave;
