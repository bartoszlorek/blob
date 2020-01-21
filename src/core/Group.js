import {utils} from 'pixi.js';

class Group {
  constructor() {
    this.children = [];
    this.isGroup = true;
  }

  add(child) {
    this.children.push(child);
  }

  remove(child) {
    for (let index = 0; index < this.children.length; index++) {
      const elem = this.children[index];

      if (elem === child) {
        utils.removeItems(this.children, index, 1);
        return true;
      }

      // handle nested group
      if (elem.isGroup && elem.remove(child)) {
        return true;
      }
    }
    return false;
  }

  contains(child) {
    for (let index = 0; index < this.children.length; index++) {
      const elem = this.children[index];

      if (elem === child || (elem.isGroup && elem.contains(child))) {
        return true;
      }
    }
    return false;
  }

  forEach(iteratee) {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      let result;

      if (child.isGroup) {
        result = child.forEach(iteratee);
      } else {
        result = iteratee(child, index, this);
      }
      if (result === false) {
        return false;
      }
    }
  }

  search(bbox, iteratee) {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      let result;

      if (child.isGroup) {
        result = child.search(bbox, iteratee);
      } else if (bbox.intersects(child)) {
        result = iteratee(child, index, this);
      }
      if (result !== undefined) {
        return result;
      }
    }
  }

  isEmpty() {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];

      if (!(child.isGroup && child.isEmpty())) {
        return false;
      }
    }
    return true;
  }
}

export default Group;
