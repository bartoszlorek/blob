import {resolveTiles} from '@utils/tiles';
import Sprite from '@models/Sprite';
import Tile from '@models/Tile';
import Tilemap from '@models/Tilemap';

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
