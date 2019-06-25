import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Colorful from '@traits/Colorful';

function createGround(global, {ground}) {
  const layer = new Layer('ground', 0xff3864);

  ground.forEach(pos => {
    const entity = new Entity(
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1]),
      global.size
    );

    entity.addTrait(new Colorful(global, {}));
    layer.append(entity);
  });

  return layer;
}

export default createGround;
