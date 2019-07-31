import {utils, Container, Rectangle} from 'pixi.js';

class Layer {
  constructor(name, filters = null, type = 'generic') {
    this.name = name;
    this.type = type;

    this.children = [];
    this.graphics = new Container();
    this.graphics.interactiveChildren = false;
    this.graphics.filters = filters;

    // object pools
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
      child.remove();
    }
    this.children.push(child);
    this.graphics.addChild(child.sprite);

    child.parent = this;
    return true;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);

    if (index < 0) {
      return false;
    }
    utils.removeItems(this.children, index, 1);
    this.graphics.removeChild(child.sprite);

    child.parent = null;
    return true;
  }

  closest(x, y) {
    this._unimplemented('closest');
  }

  closestInDirection(x, y, dX, dY, forceLimit = 0) {
    this._unimplemented('closestInDirection');
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

  _unimplemented(methodName) {
    console.warn(`${this.name}: unimplemented ${methodName}`);
  }
}

export default Layer;
