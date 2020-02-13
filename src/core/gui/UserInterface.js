// @flow strict

class UserInterface {
  root: HTMLElement;

  constructor(root: HTMLElement | null) {
    if (root == null) {
      throw Error(`${this.constructor.name} requires root element`);
    }

    this.root = root;
  }

  render() {
    // fill in subclass
  }
}

export default UserInterface;
