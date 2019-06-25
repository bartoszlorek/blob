import {GlowFilter} from '@pixi/filter-glow';
import Layer from '@models/Layer';
import Entity from '@models/Entity';

import Shine from '@traits/Shine';
import Collectable from '@traits/Collectable';

function createPrizes(global, {prizes}) {
  const color = 0xf2dc30;
  const layer = new Layer('prizes', color);

  prizes.forEach(pos => {
    const entity = new Entity(
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1])
    );

    entity.addTrait(new Shine(global, {size: global.size}));
    entity.addTrait(new Collectable(global, {}));
    layer.append(entity);
  });

  layer.filters([new GlowFilter(10, 1, 0, color)]);
  return layer;
}

export default createPrizes;
