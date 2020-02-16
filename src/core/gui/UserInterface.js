// @flow strict

import Spriteset from '@core/structure/Spriteset';

class UserInterface {
  root: HTMLElement;

  constructor(root: HTMLElement | null) {
    if (root == null) {
      throw Error(`${this.constructor.name} requires root element`);
    }

    this.root = root;
  }

  render(spriteset?: Spriteset) {
    // fill in subclass
  }

  setup(...nodes: Array<HTMLElement>) {
    const frag = document.createDocumentFragment();
    nodes.forEach(node => frag.appendChild(node));
    this.root.innerHTML = '';
    this.root.appendChild(frag);
  }
}

export default UserInterface;
