import {utils} from 'pixi.js';

class Group {
  constructor() {
    this.children = [];
    this.isGroup = true;
    this.type = null;
  }

  add(child) {
    this.children.push(child);
    this.type = child.type;
    child.parent = this;
  }

  remove(child) {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      utils.removeItems(this.children, index, 1);
      child.parent = null;
    }
  }

  contains(child) {
    return this.children.indexOf(child) !== -1;
  }
}

export default Group;
