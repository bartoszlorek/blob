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
      const item = this.children[--index];

      if (item === child || (item.isGroup && item.contains(child))) {
        return true;
      }
    }
    return false;
  }
}

export default Group;
