import Layer from '@models/Layer';
import Entity from '@models/Entity';

function createGround(data, global, level) {
  const layer = new Layer('ground', 0xff3864);

  data['ground'].forEach(pos => {
    const entity = new Entity(
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1]),
      global.size
    );

    layer.append(entity);
  });

  return layer;
}

export default createGround;
