import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import Layer from '@models/Layer';
import Entity from '@models/Entity';

function createCave(global, {cave}) {
  const layer = new Layer('cave');

  resolveBlocks('cave', cave, block => {
    const {texture} = global.assets[block.asset];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    layer.addChild(child);
  });

  return layer;
}

export default createCave;
