import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Explosive from '@traits/Explosive';

function createMines(global, {mines}) {
  const layer = new Layer('mines');

  resolveBlocks('mines', mines, block => {
    const {texture} = global.assets[block.asset];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    child.addTrait(new Explosive({global, range: 1}));
    layer.addChild(child);
  });

  return layer;
}

export default createMines;
