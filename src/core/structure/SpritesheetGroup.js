// @flow strict

import Spritesheet from '@core/structure/Spritesheet';

class SpritesheetGroup {
  children: Array<Spritesheet>;

  constructor(children: Array<Spritesheet>) {
    this.children = children;
  }

  getById(id: number) {
    for (let i = 0; i < this.children.length; i++) {
      const sheet = this.children[i];

      if (sheet.firstId > id || sheet.lastId < id) {
        continue;
      }
      return sheet.getById(id);
    }
  }

  destroy() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].destroy();
    }
  }
}

export default SpritesheetGroup;
