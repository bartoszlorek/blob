// @flow strict

import {Sprite} from 'pixi.js';
import Body from '@core/physics/Body';
import BodyGroup from '@core/physics/BodyGroup';
import Watcher from '@actions/Watcher';

import type {LayerProps} from '@layers';

function createEnemies({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['enemies'];

  if (layer.type === 'tileLayer') {
    throw Error('wrong type of layer');
  }

  let enemies = new BodyGroup();

  layer.sprites.forEach(sprite => {
    const {id, position} = sprite;
    const enemy = new Body(
      new Sprite(spriteset.spritesheet.getById(id)),
      position[0] * spriteset.tilesize,
      position[1] * spriteset.tilesize,
      spriteset.tilesize
    );

    if (global.scene) {
      enemy.addAction(new Watcher(global.scene, 60));
    }
    if (enemies) {
      enemies.add(enemy);
    }
  });

  function cleanup() {
    enemies = null;
  }

  return [enemies, cleanup];
}

export default createEnemies;
