import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Watcher from '@traits/Watcher';

function createEnemies(global, {enemies}) {
  const layer = new Layer('enemies');
  const {physics} = global.level;

  resolveBlocks('enemies', enemies, block => {
    const {texture} = global.assets[block.asset];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    child.addTrait(new Watcher({physics, speed: 60}));
    child.velocity.x = 1;
    layer.addChild(child);
  });

  return layer;
}

export default createEnemies;
