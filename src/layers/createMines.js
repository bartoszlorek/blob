import {Sprite} from 'pixi.js';

import Group from '@core/physics/Group';
import Body from '@core/physics/Body';
import Explosive from '@actions/Explosive';

function createMines({global, spriteset}) {
  const {sprites} = spriteset.layers['mines'];
  let mines = new Group();

  sprites.forEach(sprite => {
    const {id, position} = sprite;
    const mine = new Body(
      new Sprite(spriteset.spritesheet.getById(id)),
      position[0] * spriteset.tilesize,
      position[1] * spriteset.tilesize,
      spriteset.tilesize
    );

    mine.addAction(new Explosive(global));
    mines.add(mine);
  });

  function cleanup() {
    mines = null;
  }

  return [mines, cleanup];
}

export default createMines;
