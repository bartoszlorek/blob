import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Colorful from '@traits/Colorful';

function createGround(global, {ground}) {
  const layer = new Layer('ground');
  layer.solid = true;

  resolveBlocks('ground', ground, block => {
    const {texture} = global.assets[block.asset];
    const entity = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    entity.addTrait(new Colorful());
    layer.append(entity);
  });

  return layer;
}

export default createGround;
