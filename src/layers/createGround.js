import {resolveTiles} from '@utils/tiles';
import Sprite from '@models/Sprite';
import Tile from '@models/Tile';
import Tilemap from '@models/Tilemap';

function createGround({data, global}) {
  let ground = new Tilemap();

  resolveTiles('ground', data.tiles.ground, tile => {
    const {texture} = global.assets[tile.asset];
    ground.add(new Tile(new Sprite(texture, tile.x, tile.y)));
  });

  function cleanup() {
    ground = null;
  }

  return [ground, cleanup];
}

export default createGround;
