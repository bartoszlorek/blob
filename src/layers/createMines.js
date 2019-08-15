import {arrayForEach} from '@utils/array';
import Sprite from '@models/Sprite';
import Group from '@models/Group';
import Body from '@physics/Body';

import Explosive from '@traits/Explosive';

function createMines({data, global, scene}) {
  let {texture} = global.assets['mines'];
  let mines = new Group();

  if (data.static.mines) {
    arrayForEach(data.static.mines, ([x, y]) => {
      const mine = new Body(new Sprite(texture, x, y));
      mine.addTrait(new Explosive({global, scene}));
      mines.add(mine);
    });
  } else {
    mines = null;
  }

  function cleanup() {
    texture = null;
    mines = null;
  }

  return [mines, cleanup];
}

export default createMines;
