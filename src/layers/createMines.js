import {Sprite} from 'pixi.js';
import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Explosive from '@traits/Explosive';

function createMines(global, {mines}) {
  const layer = new Layer('mines');
  const {texture} = global.assets['mines'];

  mines.forEach(pos => {
    const entity = new Entity(
      new Sprite(texture),
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1])
    );

    entity.addTrait(new Explosive(global, {range: 1}));
    layer.append(entity);
  });

  return layer;
}

export default createMines;
