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
    const index = this.children.indexOf(child);

    if (index !== -1) {
      utils.removeItems(this.children, index, 1);
    }
  }

  contains(child) {
    let index = this.children.length;

    while (index > 0) {
      const elem = this.children[--index];

      if (elem === child || (elem.isGroup && elem.contains(child))) {
        return true;
      }
    }
    return false;
  }

  forEach(iteratee, index = 0) {
    const {length} = this.children;

    for (let i = 0; i < length; i++) {
      const child = this.children[i];

      if (child.isGroup) {
        child.forEach(iteratee, index);
      } else if (iteratee(child, index++, this) === false) {
        return;
      }
    }
  }
}

export default Group;
