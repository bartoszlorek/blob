import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';
import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Colorful from '@traits/Colorful';

function createGround(global, {ground}) {
  const layer = new Layer('ground');

  resolveBlocks('ground', ground, block => {
    const {texture} = global.assets[block.asset];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    child.addTrait(new Colorful());
    layer.addChild(child, block.x, block.y);
  });

  return layer;
}

export default createGround;
