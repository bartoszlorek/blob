import {utils} from 'pixi.js';

class Animations {
  constructor() {
    this.children = [];
    this.keyframes = {};
  }

  add(elem) {
    // prettier-ignore
    if (elem.isBody === true) {
      this.children.push(elem.sprite);

    } else if (elem.isGroup === true) {
      elem.children.forEach(child => {
        this.add(child);
      });
    } else {
      this.children.push(elem);
    }
  }

  remove(sprite) {
    const index = this.children.indexOf(sprite);

    if (index !== -1) {
      utils.removeItems(this.children, index, 1);
    }
  }

  update(deltaTime) {
    let index = this.children.length;

    while (index > 0) {
      const {animator} = this.children[--index];

      if (animator) {
        animator.update(this.keyframes, deltaTime);
      }
    }
  }
}

export default Animations;
