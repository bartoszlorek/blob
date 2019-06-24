import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Colorful from '@traits/Colorful';

function createGround(data, global, level) {
  const layer = new Layer('ground', 0xff3864);

  data['ground'].forEach(pos => {
    const entity = new Entity(
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1]),
      global.size
    );

    entity.addTrait(new Colorful());
    layer.append(entity);
  });

  return layer;
}

export default createGround;
