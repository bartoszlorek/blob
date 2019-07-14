import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import PassiveLayer from '@models/PassiveLayer';
import Entity from '@models/Entity';
import Explosive from '@traits/Explosive';
import Animation from '@traits/Animation';

const blinkFrames = [[50, entity => (entity.visible = !entity.visible)]];

function createMines(global, {mines}) {
  const layer = new PassiveLayer('mines');

  resolveBlocks('mines', mines, block => {
    const {texture} = global.assets[block.asset];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    child.addTrait(new Animation());
    child.addTrait(new Explosive({global, range: 1}));
    child.animation.add('blink', blinkFrames, true);

    layer.addChild(child);
  });

  return layer;
}

export default createMines;
