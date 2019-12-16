import {arrayForEach} from '@utils/array';
import {GlowFilter} from '@pixi/filter-glow';

import Sprite from '@models/Sprite';
import Group from '@models/Group';
import Animator from '@models/Animator';
import Body from '@physics/core/Body';

const glowDistance = 10;

function createPrizes({data, global, scene}) {
  let {texture} = global.assets['prizes'];
  let prizes = new Group();

  let filters = [new GlowFilter(glowDistance, 1, 0, 0xf2dc30)];
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
  }

  function cleanup() {
    texture = null;
    filters = null;
    prizes = null;
  }

  return [prizes, cleanup];
}

export default createPrizes;
