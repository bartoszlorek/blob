import {Sprite} from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import ActiveLayer from '@models/ActiveLayer';
import Entity from '@models/Entity';
import Animation from '@traits/Animation';
import Collectable from '@traits/Collectable';

const shineFrames = [
  [600, entity => (entity.scale = 0.8)],
  [1000, entity => (entity.scale = 1)]
];

function createPrizes(global, {prizes}) {
  const glow = new GlowFilter(10, 1, 0, 0xf2dc30);
  const layer = new ActiveLayer('prizes', [glow]);
  glow.padding = 10;

  resolveBlocks('prizes', prizes, block => {
    const {texture} = global.assets[block.asset];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    child.addTrait(new Collectable({global}));
    child.addTrait(new Animation());
    child.animation.add('shine', shineFrames, true);
    child.animation.shine.play();

    layer.addChild(child);
  });

  return layer;
}

export default createPrizes;
