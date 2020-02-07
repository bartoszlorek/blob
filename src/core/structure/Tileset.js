// @flow strict

import {Container, Sprite} from 'pixi.js';
import {baseSize} from '@app/constants';
import SpritesheetGroup from '@core/structure/SpritesheetGroup';
import Tilemap from '@core/structure/Tilemap';

import type {VectorType} from '@core/physics/Vector';

class Tileset extends Tilemap {
  +isBody: false;
  +isGroup: false;
  +isTiles: true;

  values: Array<number>;
  dimension: number;
  tilesize: number;
  offset: VectorType;

  children: Map<number, Sprite>;
  graphics: Container;

  constructor(values: Array<number>, dimension: number, offset: VectorType) {
    super(values, dimension, baseSize, offset);

    // pixijs
    this.children = new Map();
    this.graphics = new Container();
    this.graphics.position.x = this.offset[0] * baseSize;
    this.graphics.position.y = this.offset[1] * baseSize;

    this.isBody = false;
    this.isGroup = false;
    this.isTiles = true;
  }

  removeByIndex(index: number) {
    // remove value
    super.removeByIndex(index);

    // remove graphics
    const child = this.children.get(index);
    this.children.delete(index);
    this.graphics.removeChild(child);

    // cleanup
    this.updateCache();
  }

  updateCache() {
    this.graphics.cacheAsBitmap = false;
    this.graphics.cacheAsBitmap = true;
  }

  loadSprites(spritesheet: SpritesheetGroup) {
    this.children.clear();

    for (let index = 0; index < this.values.length; index++) {
      const tileId = this.values[index];

      if (tileId > 0) {
        const x = index % this.dimension;
        const y = Math.floor(index / this.dimension);

        const sprite = new Sprite(spritesheet.getById(tileId));
        sprite.position.x = x * baseSize;
        sprite.position.y = y * baseSize;

        this.children.set(index, sprite);
        this.graphics.addChild(sprite);
      }
    }

    this.updateCache();
  }
}

export default Tileset;
