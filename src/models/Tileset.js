import {Container, Sprite} from 'pixi.js';
import {baseSize} from '@app/consts';
import Bounds from '@models/Bounds';

class Tileset {
  constructor({tilemap, width = 1, offset = [0, 0]}) {
    this.tilemap = tilemap; // non-offsetted
    this.width = width;
    this.offset = offset;

    // pixijs
    this.graphics = new Container();
    this.graphics.position.x = offset[0] * baseSize;
    this.graphics.position.y = offset[1] * baseSize;

    // data
    this._tiles = new Map();
    this._tilesBounds = new Bounds(); // offsetted
    this._localBounds = new Bounds(); // offsetted

    // object pools
    // prettier-ignore
    this._closestArray = [ // [0-id, 0-index, 1-id, 1-index, ...]
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0
    ];

    this._shouldUpdateBounds = false;
    this.isTileset = true;
  }

  get tiles() {
    return this._tiles.values();
  }

  get tilesBounds() {
    if (this._shouldUpdateBounds) {
      this._calculateBounds();
    }
    return this._tilesBounds;
  }

  get localBounds() {
    if (this._shouldUpdateBounds) {
      this._calculateBounds();
    }
    return this._localBounds;
  }

  removeByIndex(index) {
    this.tilemap[index] = 0;

    // update data
    const tile = this._tiles.get(index);
    this._tiles.delete(index);

    // update pixi
    this.graphics.removeChild(tile);
    this._shouldUpdateBounds = true;
    this._updateCache();
  }

  closest(x, y) {
    const ox = x - this.offset[0];
    const oy = y - this.offset[1];

    const row1 = this._index(ox - 1, oy - 1);
    const row2 = this._index(ox - 1, oy);
    const row3 = this._index(ox - 1, oy + 1);
    const arr = this._closestArray;

    // row y-1
    arr[0] = this.tilemap[row1] || 0;
    arr[1] = arr[0] > 0 ? row1 : 0;

    arr[2] = this.tilemap[row1 + 1] || 0;
    arr[3] = arr[2] > 0 ? row1 + 1 : 0;

    arr[4] = this.tilemap[row1 + 2] || 0;
    arr[5] = arr[4] > 0 ? row1 + 2 : 0;

    // row y
    arr[6] = this.tilemap[row2] || 0;
    arr[7] = arr[6] > 0 ? row2 : 0;

    arr[8] = this.tilemap[row2 + 1] || 0;
    arr[9] = arr[8] > 0 ? row2 + 1 : 0;

    arr[10] = this.tilemap[row2 + 2] || 0;
    arr[11] = arr[10] > 0 ? row2 + 2 : 0;

    // row y+1
    arr[12] = this.tilemap[row3] || 0;
    arr[13] = arr[12] > 0 ? row3 : 0;

    arr[14] = this.tilemap[row3 + 1] || 0;
    arr[15] = arr[14] > 0 ? row3 + 1 : 0;

    arr[16] = this.tilemap[row3 + 2] || 0;
    arr[17] = arr[16] > 0 ? row3 + 2 : 0;

    return arr;
  }

  raycast(x, y, dx, dy) {
    const ox = x - this.offset[0];
    const oy = y - this.offset[1];
    const {minX, maxX, minY, maxY} = this.tilesBounds;

    if (dy === 1 && oy > maxY) {
      return -1;
    }

    let dist = Math.max(minY - oy, 0);

    let a = ox;
    let b = oy + dist;

    while (dist < 100) {
      const tile = this.tilemap[this._index(a, b)];

      if (tile > 0) {
        return dist;
      }
      a += dx;
      b += dy;
      dist += 1;
    }

    return dist;
  }

  closestInDirection(x, y, dX, dY, forceLimit = 0) {
    const ox = x - this.offset[0];
    const oy = y - this.offset[1];
    const {minX, maxX, minY, maxY} = this.tilesBounds;
    const xLimit = dX < 0 ? ox - minX : dX > 0 ? maxX - ox : 0;
    const yLimit = dY < 0 ? oy - minY : dY > 0 ? maxY - oy : 0;

    // for abs(x) !== abs(y)
    let limit = xLimit + yLimit;
    let a = ox;
    let b = oy;

    if (forceLimit && forceLimit < limit) {
      limit = forceLimit;
    }

    while (0 <= limit--) {
      const tile = this._tiles.get(this._index(a, b));

      if (tile) {
        return tile;
      }
      a += dX;
      b += dY;
    }
    return null;
  }

  isInsideBounds(x, y, margin = 1) {
    const ox = x - this.offset[0];
    const oy = y - this.offset[1];
    const {minX, maxX, minY, maxY} = this.tilesBounds;

    return !(
      ox < minX - margin ||
      ox > maxX + margin ||
      oy < minY - margin ||
      oy > maxY + margin
    );
  }

  _index(x, y) {
    return y * this.width + x;
  }

  _calculateBounds() {
    this._tilesBounds.clear();
    this._shouldUpdateBounds = false;

    for (let index = 0; index < this.tilemap.length; index++) {
      const tileId = this.tilemap[index];

      if (tileId > 0) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);
        this._tilesBounds.add(x + this.offset[0], y + this.offset[1]);
      }
    }
    this._calculateLocalBounds();
  }

  _calculateLocalBounds() {
    this._localBounds.minX = this._tilesBounds.minX * baseSize;
    this._localBounds.minY = this._tilesBounds.minY * baseSize;
    this._localBounds.maxX = this._tilesBounds.maxX * baseSize + baseSize;
    this._localBounds.maxY = this._tilesBounds.maxY * baseSize + baseSize;
  }

  _updateCache() {
    this.graphics.cacheAsBitmap = false;
    this.graphics.cacheAsBitmap = true;
  }

  fromSpritesheet(sheet) {
    for (let index = 0; index < this.tilemap.length; index++) {
      const tileId = this.tilemap[index];

      if (tileId > 0) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);

        const sprite = new Sprite(sheet.getById(tileId));
        sprite.position.x = x * baseSize;
        sprite.position.y = y * baseSize;

        this.graphics.addChild(sprite);
        this._tiles.set(index, sprite);
      }
    }

    this._calculateBounds();
    this._updateCache();
  }
}

export default Tileset;
