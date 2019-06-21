import {arrayForEach} from '@utils/array';

class Bounds {
  constructor(items = []) {
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;

    if (items.length) {
      this._create(items);
    }
  }

  _create(elements) {
    arrayForEach(elements, el => {
      if (el.left < this.left) {
        this.left = el.left;
      }
      if (el.right > this.right) {
        this.right = el.right;
      }
      if (el.top < this.top) {
        this.top = el.top;
      }
      if (el.bottom > this.bottom) {
        this.bottom = el.bottom;
      }
    });
  }

  merge(...bounds) {
    this._create(bounds);
  }

  extend(value) {
    this.top -= value;
    this.right += value;
    this.bottom += value;
    this.left -= value;
  }
}

export default Bounds;
