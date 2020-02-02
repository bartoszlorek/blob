// @flow strict

import type Body from '@core/physics/Body';

class Action {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(body: Body, deltaTime: number) {
    // fill in subclass
  }

  collide() {
    // fill in subclass
  }
}

export default Action;
