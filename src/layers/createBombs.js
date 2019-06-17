import Layer from '@models/Layer';
import Entity from '@models/Entity';

import Explosive from '@traits/Explosive';

const BOMBS_COLOR = 0x0b46a4;

function createBombs(data, global, level) {
  const layer = new Layer('bombs', BOMBS_COLOR);
  layer.solid = true;

  if (data['bombs']) {
    data['bombs'].forEach(pos => {
      const entity = new Entity(
        global.gridToLocal(pos[0]),
        global.gridToLocal(pos[1]),
        global.size
      );
      entity.addTrait(new Explosive(global.size));
      layer.append(entity);
    });
  }

  return layer;
}

export default createBombs;
