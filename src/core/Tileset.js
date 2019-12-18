import {Container, Sprite} from 'pixi.js';
import {baseSize} from '@app/consts';
import Tilemap from '@core/Tilemap';

class Tileset extends Tilemap {
  constructor(values, dimension, offset) {
    super(values, dimension, baseSize, offset);

    // pixijs
    this.children = new Map();
    this.graphics = new Container();
    this.graphics.position.x = this.offset[0] * baseSize;
    this.graphics.position.y = this.offset[1] * baseSize;

    // parameters
    this.isTileset = true;
  }

  removeByIndex(index) {
    super.removeByIndex(index);
    const child = this.children.get(index);
    this.children.delete(index);
    this.graphics.removeChild(child);
    this.updateCache();
  }

  updateCache() {
    this.graphics.cacheAsBitmap = false;
    this.graphics.cacheAsBitmap = true;
  }

  loadSprites(sheet) {
    this.children.clear();

    for (let index = 0; index < this.values.length; index++) {
      const tileId = this.values[index];

      if (tileId > 0) {
        const x = index % this.dimension;
        const y = Math.floor(index / this.dimension);

        const sprite = new Sprite(sheet.getById(tileId));
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
