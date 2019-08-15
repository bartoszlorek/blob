import Sprite from '@models/Sprite';
import Group from '@models/Group';
import Body from '@physics/Body';

import Explosive from '@traits/Explosive';

function createMines({data, global, scene}) {
  let {texture} = global.assets['mines'];
  let mines = new Group();

  data.static.mines.forEach(([x, y]) => {
    const mine = new Body(new Sprite(texture, x, y));

    mine.addTrait(new Explosive({global, scene}));
    mines.add(mine);
  });

  function cleanup() {
    texture = null;
    mines = null;
  }

  return [mines, cleanup];
}

export default createMines;
