import {Sprite} from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';
import Layer from '@models/Layer';
import Entity from '@models/Entity';

import Shine from '@traits/Shine';
import Collectable from '@traits/Collectable';

function createPrizes(global, {prizes}) {
  const layer = new Layer('prizes');
  const {texture} = global.assets['prizes'];

  prizes.forEach(pos => {
    const entity = new Entity(
      new Sprite(texture),
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1])
    );

    entity.addTrait(new Shine(global, {}));
    entity.addTrait(new Collectable(global, {}));
    layer.append(entity);
  });

  layer.filters([new GlowFilter(10, 1, 0, 0xf2dc30)]);
  return layer;
}

export default createPrizes;
