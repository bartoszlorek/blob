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
}

export default UserInterface;
