import {baseSize} from '@app/consts';
import Bounds from './Bounds';

class Tilemap {
  constructor(width = 10) {
    this.width = width + 3;
    this.tiles = new Map();

    this.isTilemap = true;

    // object pools
    this._closestArray = [];
    this._bounds = new Bounds();
    this._localBounds = new Bounds();

    // dirty flags
    this._shouldUpdateBounds = false;
  }

  get bounds() {
    if (this._shouldUpdateBounds) {
      this._calculateBounds();
    }
    return this._bounds;
  }

  get localBounds() {
    if (this._shouldUpdateBounds) {
      this._calculateBounds();
    }
    return this._localBounds;
  }

  add(tile) {
    tile.parent = this;
    this.tiles.set(this._index(tile.x, tile.y), tile);
    this._bounds.add(tile.x, tile.y);
    this._calculateLocalBounds();
  }

  remove(tile) {
    this.tiles.delete(this._index(tile.x, tile.y));
    this._shouldUpdateBounds = true;
  }

  closest(x, y) {
    const bounds = this.bounds;
    if (
      x < bounds.minX - 1 ||
      x > bounds.maxX + 1 ||
      y < bounds.minY - 1 ||
      y > bounds.maxY + 1
    ) {
      return null;
    }

    const row1 = this._index(x - 1, y - 1);
    const row2 = this._index(x - 1, y);
    const row3 = this._index(x - 1, y + 1);

    this._closestArray[0] = this.tiles.get(row1);
    this._closestArray[1] = this.tiles.get(row1 + 1);
    this._closestArray[2] = this.tiles.get(row1 + 2);

    this._closestArray[3] = this.tiles.get(row2);
    this._closestArray[4] = this.tiles.get(row2 + 1);
    this._closestArray[5] = this.tiles.get(row2 + 2);

    this._closestArray[6] = this.tiles.get(row3);
    this._closestArray[7] = this.tiles.get(row3 + 1);
    this._closestArray[8] = this.tiles.get(row3 + 2);

    return this._closestArray;
  }

  closestInDirection(x, y, dX, dY, forceLimit = 0) {
    const {minX, maxX, minY, maxY} = this.bounds;
    const xLimit = dX < 0 ? x - minX : dX > 0 ? maxX - x : 0;
    const yLimit = dY < 0 ? y - minY : dY > 0 ? maxY - y : 0;

    // for abs(x) !== abs(y)
    let limit = xLimit + yLimit;
    let a = x;
    let b = y;

    if (forceLimit && forceLimit < limit) {
      limit = forceLimit;
    }

    while (0 <= limit--) {
      const tile = this.tiles.get(this._index(a, b));

      if (tile) {
        return tile;
      }
      a += dX;
      b += dY;
    }
    return null;
  }

  _index(x, y) {
    return y * this.width + x;
  }

  _calculateBounds() {
    this._bounds.clear();
    this._shouldUpdateBounds = false;
    const tiles = this.tiles.values();

    for (let tile of tiles) {
      this._bounds.add(tile.x, tile.y);
    }
    this._calculateLocalBounds();
  }

  _calculateLocalBounds() {
    this._localBounds.minX = this._bounds.minX * baseSize;
    this._localBounds.minY = this._bounds.minY * baseSize;
    this._localBounds.maxX = this._bounds.maxX * baseSize + baseSize;
    this._localBounds.maxY = this._bounds.maxY * baseSize + baseSize;
  }
}

export default Tilemap;
