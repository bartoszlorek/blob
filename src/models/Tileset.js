import {Container, Sprite} from 'pixi.js';
import {baseSize} from '@app/consts';
import Tilemap from '@models/Tilemap';

class Tileset extends Tilemap {
  constructor(values, width, offset) {
    super(values, width, offset);

    // pixijs
    this.children = new Map();
    this.graphics = new Container();
    this.graphics.position.x = offset[0] * baseSize;
    this.graphics.position.y = offset[1] * baseSize;

    this._localBounds = new Bounds();
    this.isTileset = true;
  }

  get localBounds() {
    if (this._shouldUpdateBounds) {
      this._calculateBounds();
    }
    return this._localBounds;
  }

  _calculateBounds() {
    super._calculateBounds();
    this._localBounds.minX = this._bounds.minX * baseSize;
    this._localBounds.minY = this._bounds.minY * baseSize;
    this._localBounds.maxX = this._bounds.maxX * baseSize + baseSize;
    this._localBounds.maxY = this._bounds.maxY * baseSize + baseSize;
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
        const x = index % this.width;
        const y = Math.floor(index / this.width);

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
