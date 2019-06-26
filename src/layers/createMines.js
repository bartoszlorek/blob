import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Explosive from '@traits/Explosive';
import {renderMine} from '@renders/mine';

function createMines(global, {mines}) {
  const layer = new Layer('mines', 0x0e132b);
  layer.renderer = renderMine;

  mines.forEach(pos => {
    const entity = new Entity(
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1]),
      global.size
    );

    entity.addTrait(new Explosive(global, {range: 1}));
    layer.append(entity);
  });

  return layer;
}

export default createMines;
