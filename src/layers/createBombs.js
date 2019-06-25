import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Explosive from '@traits/Explosive';

function createBombs(global, {bombs}) {
  const layer = new Layer('bombs', 0x0d0221);

  bombs.forEach(pos => {
    const entity = new Entity(
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1]),
      global.size
    );

    entity.addTrait(new Explosive(global, {range: global.size}));
    layer.append(entity);
  });

  return layer;
}

export default createBombs;
