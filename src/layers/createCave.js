import {resolveTiles} from '@utils/tiles';
import Sprite from '@models/Sprite';
import Tile from '@models/Tile';
import Tilemap from '@models/Tilemap';

function createCave({data, global}) {
  const cave = new Tilemap();

  resolveTiles('cave', data.tiles.cave, tile => {
    const {texture} = global.assets[tile.asset];
    cave.add(new Tile(new Sprite(texture, tile.x, tile.y)));
  });

  return cave;
}

export default createCave;
