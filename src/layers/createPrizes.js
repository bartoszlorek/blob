import {Sprite} from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';
import {baseSize} from '@app/constants';

import Group from '@core/structure/Group';
import Animator from '@core/animation/Animator';
import Body from '@core/physics/Body';

const glowDistance = 10;

function createPrizes({global, sheet, data}) {
  const {id, position} = data.sprites.prizes;

  let prizes = new Group();
  let filters = [new GlowFilter(glowDistance, 1, 0, 0xf2dc30)];
  filters[0].padding = glowDistance;

  position.forEach(([x, y]) => {
    const prize = new Body(
      new Sprite(sheet.getById(id)),
      x * baseSize,
      y * baseSize,
      baseSize
    );

    prize.sprite.filters = filters;
    prizes.add(prize);
  });

  function cleanup() {
    prizes = null;
    filters = null;
  }

  return [prizes, cleanup];
}

export default createPrizes;
