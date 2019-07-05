import {Sprite} from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Shine from '@traits/Shine';
import Collectable from '@traits/Collectable';

function createPrizes(global, {prizes}) {
  const layer = new Layer('prizes');

  resolveBlocks('prizes', prizes, block => {
    const {texture} = global.assets[block.asset];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    child.addTrait(new Shine());
    child.addTrait(new Collectable({level: global.level}));
    layer.addChild(child);
  });

  layer.graphics.filters = [new GlowFilter(10, 1, 0, 0xf2dc30)];
  return layer;
}

export default createPrizes;
