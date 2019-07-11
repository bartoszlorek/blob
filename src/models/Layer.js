import {baseSize} from '@app/consts';
import {utils, Container, Rectangle} from 'pixi.js';

class Layer {
  constructor(name = '', width = 10) {
    this.name = name;
    this.width = width + 3;
    this.children = [];

    this._position = {};
    this._stackIndex = 0;

    // physics
    this.selfCollision = false;
    this.passive = false;

    // pixijs
    this.graphics = new Container();
    this.graphics.interactiveChildren = false;

    // object pools
    this._stack = [];
    this._closestArray = [];
    this._boundsRect = new Rectangle();
    this._boundsGrid = {};
    this._bounds = {};

    // dirty flags
    this._shouldUpdateBounds = false;
  }

  get bounds() {
    if (this._shouldUpdateBounds) {
      this._calculateBounds();
    }
    return this._bounds;
  }

  get boundsGrid() {
    if (this._shouldUpdateBounds) {
      this._calculateBounds();
    }
    return this._boundsGrid;
  }

  addChild(child) {
    if (child.parent === this) {
      return false;
    }
    if (child.parent !== null) {
      child.parent.removeChild(child);
    }
    this.children.push(child);
    this.graphics.addChild(child.sprite);
    this._updatePosition(child);
    child.parent = this;
  }

  removeChild(child) {
    const childIndex = this.children.indexOf(child);
    const index = this._index(child.gridX, child.gridY);

    if (childIndex !== -1) {
      utils.removeItems(this.children, childIndex, 1);
    }
    this.graphics.removeChild(child.sprite);
    this._removePosition(index);
    child.parent = null;
  }

  willChange(child) {
    if (!child.processing && child.parent === this) {
      const index = this._index(child.gridX, child.gridY);
      this._stack[this._stackIndex++] = index;
      this._stack[this._stackIndex++] = child;
      child.processing = true;
    }
  }

  update(deltaTime) {
    let index = this.children.length;

    while (index > 0) {
      this.children[--index].update(deltaTime);
    }
  }

  memoize() {
    while (this._stackIndex > 0) {
      const child = this._stack[--this._stackIndex];
      const index = this._stack[--this._stackIndex];
      // console.log('change:', this.name);

      if (child) {
        this._removePosition(index);
        this._updatePosition(child);
        child.processing = false;
      }
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

    this._closestArray[0] = this._position[row1];
    this._closestArray[1] = this._position[row1 + 1];
    this._closestArray[2] = this._position[row1 + 2];

    this._closestArray[3] = this._position[row2];
    this._closestArray[4] = this._position[row2 + 1];
    this._closestArray[5] = this._position[row2 + 2];

    this._closestArray[6] = this._position[row3];
    this._closestArray[7] = this._position[row3 + 1];
    this._closestArray[8] = this._position[row3 + 2];

    return this._closestArray;
  }

  closestInRange(x, y, radius) {}

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
      const child = this._position[this._index(a, b)];

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

  _updatePosition(child) {
    this._position[this._index(child.gridX, child.gridY)] = child;
    this._shouldUpdateBounds = true;
  }

  _removePosition(index) {
    this._position[index] = undefined;
    this._shouldUpdateBounds = true;
  }

  _calculateBounds() {
    this.graphics.getLocalBounds(this._boundsRect);

    // transform into local units
    this._bounds.top = this._boundsRect.y;
    this._bounds.left = this._boundsRect.x;
    this._bounds.right = this._boundsRect.x + this._boundsRect.width;
    this._bounds.bottom = this._boundsRect.y + this._boundsRect.height;

    // transform into grid units
    this._boundsGrid.top = Math.ceil(this._bounds.top / baseSize);
    this._boundsGrid.left = Math.ceil(this._bounds.left / baseSize);
    this._boundsGrid.right = Math.floor(this._bounds.right / baseSize);
    this._boundsGrid.bottom = Math.floor(this._bounds.bottom / baseSize);

    this._shouldUpdateBounds = false;
  }
}

export default Layer;
