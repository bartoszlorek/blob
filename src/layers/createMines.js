import {Sprite} from 'pixi.js';
import {baseSize} from '@app/consts';

import Group from '@core/Group';
import Body from '@physics/core/Body';
import Explosive from '@actions/Explosive';

function createMines({global, sheet, data}) {
  const {id, position} = data.sprites.mines;

  let mines = new Group();

  position.forEach(([x, y]) => {
    const mine = new Body(
      new Sprite(sheet.getById(id)),
      x * baseSize,
      y * baseSize,
      baseSize
    );

    // mine.addAction(new Explosive({global}));
    mines.add(mine);
  });

  function cleanup() {
    mines = null;
  }

  return [mines, cleanup];
}

export default createMines;
