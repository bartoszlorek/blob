import {arrayForEach, arrayFilter} from '@utils/array';

class Container {
  constructor() {
    this.items = [];
  }

  get length() {
    return this.items.length;
  }

  has(item) {
    return this.items.indexOf(item) !== -1;
  }

  add(item) {
    if (!this.has(item)) {
      this.items.push(item);
    }
  }

  remove(item) {
    this.items = arrayFilter(this.items, a => a !== item);
  }

  forEach(iteratee) {
    arrayForEach(this.items, iteratee);
  }
}

export default Container;
