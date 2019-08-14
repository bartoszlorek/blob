import {resolveTiles} from '@utils/tiles';
import Sprite from '@models/Sprite';
import Tile from '@models/Tile';
import Tilemap from '@models/Tilemap';

function createGround({data, global}) {
  const ground = new Tilemap();

  resolveTiles('ground', data.tiles.ground, tile => {
    const {texture} = global.assets[tile.asset];
    ground.add(new Tile(new Sprite(texture, tile.x, tile.y)));
  });

  return ground;
}

export default createGround;
