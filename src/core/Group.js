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

  forEach(iteratee, index = 0) {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];

      if (child.isGroup) {
        child.forEach(iteratee, index);
      } else if (iteratee(child, index++, this) === false) {
        return;
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
