// @flow strict

class Action {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(deltaTime: number) {
    // fill in subclass
  }

  collide() {
    // fill in subclass
  }
}

export default Action;
