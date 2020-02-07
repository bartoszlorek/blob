// @flow strict

import type Body from '@core/physics/Body';
import type {EdgeType} from '@core/physics/constants';

class Trait {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(body: Body, deltaTime: number) {
    // fill in subclass
  }

  collide(body: Body, edge: EdgeType) {
    // fill in subclass
  }
}

export default Trait;
