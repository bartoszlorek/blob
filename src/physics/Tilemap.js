import Bounds from './Bounds';

class Tilemap {
  constructor(width, offset = 0) {
    this.width = width + 3;
    this.offset = offset;
    this.isTilemap = true;
    this.tiles = {};

    // object pools
    this._closestArray = [];
    this._bounds = new Bounds();

    // dirty flags
    this._shouldUpdateBounds = false;
  }

  get bounds() {
    if (this._shouldUpdateBounds) {
      this._calculateBounds();
    }
    return this._bounds;
  }

  add(tile) {
    tile.parent = this;
    this.tiles[this._index(tile.x, tile.y)] = tile;
    this._bounds.add(tile.x, tile.y);
  }

  remove(tile) {
    this.tiles[this._index(tile.x, tile.y)] = null;
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

    this._closestArray[0] = this.tiles[row1];
    this._closestArray[1] = this.tiles[row1 + 1];
    this._closestArray[2] = this.tiles[row1 + 2];

    this._closestArray[3] = this.tiles[row2];
    this._closestArray[4] = this.tiles[row2 + 1];
    this._closestArray[5] = this.tiles[row2 + 2];

    this._closestArray[6] = this.tiles[row3];
    this._closestArray[7] = this.tiles[row3 + 1];
    this._closestArray[8] = this.tiles[row3 + 2];

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
      const tile = this.tiles[this._index(a, b)];

      if (tile) {
        return tile;
      }
      a += dX;
      b += dY;
    }
    return null;
  }

  forEach(iteratee) {
    const tiles = this.tiles;
    const props = Object.keys(tiles);

    for (let index = 0; index < props.length; index++) {
      const tile = tiles[props[index]];

      if (tile && iteratee(tile, index) === false) {
        return;
      }
    }
  }

  _index(x, y) {
    return (y - this.offset) * this.width + x - this.offset;
  }

  _calculateBounds() {
    this._bounds.clear();
    this._shouldUpdateBounds = false;

    this.forEach(tile => {
      this._bounds.add(tile.x, tile.y);
    });
  }
}

export default Tilemap;
