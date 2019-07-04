import {baseSize} from '@app/consts';
import {utils, Container, Rectangle} from 'pixi.js';
import {extendBounds} from '@utils/pixijs';

class Layer {
  constructor(name = '', width = 10) {
    this.name = name;
    this.children = [];
    this.position = {};

    // pixijs
    this.graphics = new Container();
    this.graphics.interactiveChildren = false;

    // object pools
    this._closestArray = [];
    this._boundsRect = new Rectangle();
    this._boundsGrid = {};
    this._bounds = {};

    this._boundsID = 0;
    this._lastBoundsID = -1;

    // parameters
    this.resolution = width + 3;
    this.filterMargin = 10;
  }

  get bounds() {
    if (this._boundsID !== this._lastBoundsID) {
      this._calculateBounds();
    }
    return this._bounds;
  }

  get boundsGrid() {
    if (this._boundsID !== this._lastBoundsID) {
      this._calculateBounds();
    }
    return this._boundsGrid;
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

  requestChange(child) {
    // todo: optimization
    this._updatePosition(child);
  }

  update(deltaTime) {
    for (let i = 0, j = this.children.length; i < j; ++i) {
      this.children[i].update(deltaTime);
    }
    // it invokes after all changes
    this._updateFilters();
  }

  closest(x, y) {
    // check if is outside bounds
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
    let limit = 100;

    if (dX === 0) {
      let pos = y; // search vertically

      while (limit--) {
        if (pos < this.boundsGrid.top - 1 || pos > this.boundsGrid.bottom + 1) {
          return null;
        }
        const child = this.position[this._index(x, pos)];

        if (child) {
          return child;
        }
        pos += dY;
      }
    } else {
      let pos = x; // search horizontally

      while (limit--) {
        if (pos < this.boundsGrid.left - 1 || pos > this.boundsGrid.right + 1) {
          return null;
        }
        const child = this.position[this._index(pos, y)];

        if (child) {
          return child;
        }
        pos += dX;
      }
    }

    return null;
  }

  _index(x, y) {
    return y * this.resolution + x;
  }

  _updatePosition(child) {
    this.position[this._index(child.gridX, child.gridY)] = child;
    this._boundsID++;
  }

  _removePosition(child) {
    this.position[this._index(child.gridX, child.gridY)] = undefined;
    this._boundsID++;
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

  _calculateBounds() {
    this.graphics.getLocalBounds(this._boundsRect);

    // transform into extreme form
    this._bounds.top = this._boundsRect.y;
    this._bounds.left = this._boundsRect.x;
    this._bounds.right = this._boundsRect.x + this._boundsRect.width;
    this._bounds.bottom = this._boundsRect.y + this._boundsRect.height;

    // transform into grid form
    this._boundsGrid.top = Math.ceil(this._bounds.top / baseSize);
    this._boundsGrid.left = Math.ceil(this._bounds.left / baseSize);
    this._boundsGrid.right = Math.floor(this._bounds.right / baseSize);
    this._boundsGrid.bottom = Math.floor(this._bounds.bottom / baseSize);

    this._lastBoundsID = this._boundsID;
  }
}

export default Layer;
