import {resolveTiles} from '@utils/tiles';
import Sprite from '@core/Sprite';
import Tile from '@core/Tile';
import Tilemap from '@core/Tilemap';

function createGround({data, global}) {
  let ground = new Tilemap();

  if (data.tiles.ground) {
    resolveTiles('ground', data.tiles.ground, tile => {
      const {texture} = global.assets[tile.asset];
      ground.add(new Tile(new Sprite(texture, tile.x, tile.y)));
    });
  } else {
    ground = null;
  }

  function cleanup() {
    ground = null;
  }

  return [ground, cleanup];
}

export default createGround;
