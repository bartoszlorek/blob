import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Explosive from '@traits/Explosive';

function createMines(global, {mines}) {
  const layer = new Layer('mines');
  layer.solid = true;

  resolveBlocks('mines', mines, block => {
    const {texture} = global.assets[block.asset];
    const entity = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    entity.addTrait(new Explosive({global, range: 1}));
    layer.append(entity);
  });

  return layer;
}

export default createMines;
