import {utils, Container} from 'pixi.js';
import {extendBounds} from '@utils/pixijs';

class Layer {
  constructor(name = '') {
    this.name = name;
    this.children = [];
    this.position = {};

    // pixijs
    this.graphics = new Container();
    this.graphics.interactiveChildren = false;

    // parameters
    this.resolution = 100;
    this.filterMargin = 10;

    // object pools
    this._closestArray = [];
  }

  addChild(child) {
    if (child.parent === this) {
      return false;
    }
    if (child.parent !== null) {
      child.parent.remove(child);
    }
    child.parent = this;

    this.children.push(child);
    this.graphics.addChild(child.sprite);
    this._updatePosition(child);
  }

  removeChild(child) {
    if (child.parent !== this) {
      return false;
    }
    child.parent = null;
    const index = this.children.indexOf(child);

    if (index !== -1) {
      utils.removeItems(this.children, index, 1);
    }
    this.graphics.removeChild(child.sprite);
    this._removePosition(child);
  }

  update(deltaTime) {
    for (let i = 0, j = this.children.length; i < j; ++i) {
      this.children[i].update(deltaTime);
    }
    // it invokes after all changes
    this._updateFilters();
  }

  requestChange(child) {
    // todo: optimization
    this._updatePosition(child);
  }

  closest(x, y) {
    const row1 = this._index(x - 1, y - 1);
    const row2 = this._index(x - 1, y);
    const row3 = this._index(x - 1, y + 1);

    this._closestArray[0] = this.position[row1];
    this._closestArray[1] = this.position[row1 + 1];
    this._closestArray[2] = this.position[row1 + 2];

    this._closestArray[3] = this.position[row2];
    this._closestArray[4] = this.position[row2 + 1];
    this._closestArray[5] = this.position[row2 + 2];

    this._closestArray[6] = this.position[row3];
    this._closestArray[7] = this.position[row3 + 1];
    this._closestArray[8] = this.position[row3 + 2];

    return this._closestArray;
  }

  closestInDirection(x, y, dX, dY) {
    // todo: limit to bounds
    let limit = 100;
    let a = x;
    let b = y;

    while (limit--) {
      const child = this.position[this._index(a, b)];

      if (child) {
        return child;
      }
      a += dX;
      b += dY;
    }

    return null;
  }

  _index(x, y) {
    return y * this.resolution + x;
  }

  _updatePosition(child) {
    this.position[this._index(child.gridX, child.gridY)] = child;
  }

  _removePosition(child) {
    this.position[this._index(child.gridX, child.gridY)] = undefined;
  }

  _updateFilters() {
    if (!this.graphics.filters) {
      return;
    }
    // todo: cache bounds for static layers
    this.graphics.filterArea = extendBounds(
      this.graphics.getBounds(),
      this.filterMargin
    );
  }
}

export default Layer;
