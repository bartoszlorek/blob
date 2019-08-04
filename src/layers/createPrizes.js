import {GlowFilter} from '@pixi/filter-glow';
import Sprite from '@models/Sprite';
import Group from '@models/Group';
import Body from '@physics/Body';

// const shineFrames = [
//   [600, entity => (entity.scale = 0.8)],
//   [1000, entity => (entity.scale = 1)]
// ];

function createPrizes(global, data) {
  const {texture} = global.assets['prizes'];
  const prizes = new Group();

  // effects
  const filters = [new GlowFilter(10, 1, 0, 0xf2dc30)];
  filters[0].padding = 10;

  data.static.prizes.forEach(([x, y]) => {
    const body = new Body(new Sprite(texture, x, y));
    body.sprite.filters = filters;
    prizes.add(body);
  });

  return prizes;
}

export default createPrizes;
