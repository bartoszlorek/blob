import Layer from '@models/Layer';

class TileLayer extends Layer {
  constructor(name, filters, width = 10) {
    super(name, filters, 'passive');

    this.width = width + 3;

    // object pools
    this._tilesmap = {};
    this._closestArray = [];
  }

  addChild(child) {
    if (super.addChild(child)) {
      this._updateTilesmap(child);
    }
  }

  removeChild(child) {
    if (super.removeChild(child)) {
      const index = this._index(child.gridX, child.gridY);
      this._removeTilesmap(index);
    }
  }

  closest(x, y) {
    if (
      x < this.boundsGrid.left - 1 ||
      x > this.boundsGrid.right + 1 ||
      y < this.boundsGrid.top - 1 ||
      y > this.boundsGrid.bottom + 1
    ) {
      return null;
    }
    const row1 = this._index(x - 1, y - 1);
    const row2 = this._index(x - 1, y);
    const row3 = this._index(x - 1, y + 1);

    this._closestArray[0] = this._tilesmap[row1];
    this._closestArray[1] = this._tilesmap[row1 + 1];
    this._closestArray[2] = this._tilesmap[row1 + 2];

    this._closestArray[3] = this._tilesmap[row2];
    this._closestArray[4] = this._tilesmap[row2 + 1];
    this._closestArray[5] = this._tilesmap[row2 + 2];

    this._closestArray[6] = this._tilesmap[row3];
    this._closestArray[7] = this._tilesmap[row3 + 1];
    this._closestArray[8] = this._tilesmap[row3 + 2];

    return this._closestArray;
  }

  closestInDirection(x, y, dX, dY, forceLimit = 0) {
    const {left, right, top, bottom} = this.boundsGrid;
    const xLimit = dX < 0 ? x - left : dX > 0 ? right - x : 0;
    const yLimit = dY < 0 ? y - top : dY > 0 ? bottom - y : 0;

    // for abs(x) !== abs(y)
    let limit = xLimit + yLimit;
    let a = x;
    let b = y;

    if (forceLimit && forceLimit < limit) {
      limit = forceLimit;
    }

    while (0 <= limit--) {
      const child = this._tilesmap[this._index(a, b)];

      if (child) {
        return child;
      }
      a += dX;
      b += dY;
    }
    return null;
  }

  _index(x, y) {
    return y * this.width + x;
  }

  _updateTilesmap(child) {
    this._tilesmap[this._index(child.gridX, child.gridY)] = child;
    this._shouldUpdateBounds = true;
  }

  _removeTilesmap(index) {
    this._tilesmap[index] = undefined;
    this._shouldUpdateBounds = true;
  }
}

export default TileLayer;
