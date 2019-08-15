import {arrayForEach} from '@utils/array';
import {GlowFilter} from '@pixi/filter-glow';
import Sprite from '@models/Sprite';
import Group from '@models/Group';
import Body from '@physics/Body';

// const shineFrames = [
//   [600, entity => (entity.scale = 0.8)],
//   [1000, entity => (entity.scale = 1)]
// ];

const glowDistance = 10;

function createPrizes({data, global}) {
  let {texture} = global.assets['prizes'];
  let prizes = new Group();

  let filters = [new GlowFilter(glowDistance, 1, 0, 0xf2dc30)];
  filters[0].padding = glowDistance;

  if (data.static.prizes) {
    arrayForEach(data.static.prizes, ([x, y]) => {
      const prize = new Body(new Sprite(texture, x, y));
      prize.sprite.filters = filters;
      prizes.add(prize);
    });
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
