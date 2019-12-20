import {Sprite} from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';
import {baseSize} from '@app/consts';

import Group from '@core/Group';
import Animator from '@core/Animator';
import Body from '@physics/core/Body';

const glowDistance = 10;

function createPrizes({global, sheet, data}) {
  const {id, position} = data.sprites.prizes;

  let prizes = new Group();
  let filters = [];

  position.forEach(([x, y]) => {
    const prize = new Body(
      new Sprite(sheet.getById(id)),
      x * baseSize,
      y * baseSize,
      baseSize
    );

    prizes.add(prize);
  });

  /*
  let {texture} = global.assets['prizes'];
   [new GlowFilter(glowDistance, 1, 0, 0xf2dc30)];
  filters[0].padding = glowDistance;

  if (data.static.prizes) {
    arrayForEach(data.static.prizes, ([x, y]) => {
      const sprite = new Sprite(texture, x, y);
      sprite.filters = filters;

      // animation
      sprite.animator = new Animator();
      sprite.animator.add('shine', [sprite]);
      sprite.animator.shine.play();

      // group
      prizes.add(new Body(sprite));
    });

    scene.animations.add(prizes);
    scene.animations.keyframes['shine'] = [
      [600, sprite => sprite.scale.set(0.8)],
      [1000, sprite => sprite.scale.set(1)],
    ];
  } else {
    prizes = null;
  }*/

  function cleanup() {
    prizes = null;
    filters = null;
  }

  return [prizes, cleanup];
}

export default createPrizes;
