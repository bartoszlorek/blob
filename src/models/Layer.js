import {baseSize} from '@app/consts';
import {utils, Container} from 'pixi.js';

class Layer {
  constructor(name, filters = null, type = 'generic') {
    this.name = name;
    this.type = type;

    this.children = [];
    this.graphics = new Container();
    this.graphics.interactiveChildren = false;
    this.graphics.filters = filters;
  }

  get bounds() {
    this._unimplemented('bounds');
  }

  get boundsGrid() {
    this._unimplemented('boundsGrid');
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

    child.parent = this;
    return true;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      utils.removeItems(this.children, index, 1);
    }
    this.graphics.removeChild(child.sprite);
    child.parent = null;
  }

  update(deltaTime) {
    let index = this.children.length;

    while (index > 0) {
      this.children[--index].update(deltaTime);
    }
  }

  postUpdate() {
    // fill later
  }

  closest(x, y) {
    this._unimplemented('closest');
  }

  closestInRange(x, y, radius) {
    this._unimplemented('closestInRange');
  }

  closestInDirection(x, y, dX, dY, forceLimit = 0) {
    this._unimplemented('closestInDirection');
  }

  _unimplemented(methodName) {
    console.warn(`${this.name}: unimplemented ${methodName}`);
  }
}

export default Layer;
