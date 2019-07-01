import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
import {resolveBlocks} from '@utils/blocks';

import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Watcher from '@traits/Watcher';

function createEnemies(global, {enemies}) {
  const layer = new Layer('enemies');
  const {ground} = global.level.layers;

  resolveBlocks('enemies', enemies, block => {
    const {texture} = global.assets[block.asset];
    const entity = new Entity(
      new Sprite(texture),
      gridToLocal(block.x),
      gridToLocal(block.y)
    );

    entity.addTrait(new Watcher({speed: 60, ground}));
    layer.append(entity);
  });

  return layer;
}

export default createEnemies;
