import {Sprite} from 'pixi.js';
import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Colorful from '@traits/Colorful';

function createGround(global, {ground}) {
  const layer = new Layer('ground');
  const {texture} = global.assets['ground'];

  ground.forEach(pos => {
    const entity = new Entity(
      new Sprite(texture),
      global.gridToLocal(pos[0]),
      global.gridToLocal(pos[1])
    );

    entity.addTrait(new Colorful(global, {}));
    layer.append(entity);
  });

  return layer;
}

export default createGround;
