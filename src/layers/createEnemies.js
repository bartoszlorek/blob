import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import ActiveLayer from '@models/ActiveLayer';
import Entity from '@models/Entity';
import Watcher from '@traits/Watcher';

function createEnemies({enemies}, global, scene) {
  const layer = new ActiveLayer('enemies');

  resolveBlocks('enemies', enemies, block => {
    const {texture} = global.assets[block.asset];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    child.addTrait(new Watcher({global, scene, speed: 60}));
    layer.addChild(child);
  });

  return layer;
}

export default createEnemies;
