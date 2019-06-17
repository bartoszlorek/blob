import {GlowFilter} from '@pixi/filter-glow';
import Layer from '@models/Layer';
import Entity from '@models/Entity';

import Shine from '@traits/Shine';
import Collectable from '@traits/Collectable';

const PRIZES_COLOR = 0xf2dc30;

function createPrizes(data, global, level) {
  const layer = new Layer('prizes', PRIZES_COLOR);
  layer.graphics.filters = [new GlowFilter(10, 1, 0, PRIZES_COLOR)];

  data['prizes'].forEach(pos => {
    const entity = new Entity(
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1]),
      global.size
    );

    entity.addTrait(new Shine(global.size));
    entity.addTrait(new Collectable());
    layer.append(entity);
  });

  return layer;
}

export default createPrizes;
