import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import TileLayer from '@models/TileLayer';
import Entity from '@models/Entity';
import Colorful from '@traits/Colorful';

function createGround({ground}, global, level) {
  const layer = new TileLayer('ground');

  console.log({layer});

  resolveBlocks('ground', ground, block => {
    const {texture} = global.assets[block.asset];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    child.addTrait(new Colorful());
    layer.addChild(child);
  });

  return layer;
}

export default createGround;
