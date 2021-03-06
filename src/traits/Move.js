// @flow strict

import {rotateVector} from '@utils/physics';
import Vector from '@core/physics/Vector';
import Trait from '@core/Trait';

import type Body from '@core/physics/Body';

// mutable data
const m_vector = Vector.create();

class Move extends Trait {
  moving: boolean;
  direction: number;
  acceleration: number;
  deceleration: number;
  dragFactor: number;

  constructor() {
    super('move');
    this.direction = 0;
    this.moving = false;

    // parameters
    this.acceleration = 650;
    this.deceleration = 350;
    this.dragFactor = 0.94;
  }

  forward() {
    this.direction += 1;
  }

  backward() {
    this.direction -= 1;
  }

  update(body: Body, deltaTime: number) {
    m_vector[0] = this.direction;
    m_vector[1] = 0;

    const {velocity, gravity, sprite} = body;
    const axis = gravity && Vector.isHorizontal(gravity.vector) ? 1 : 0;

    const actualDirection = gravity
      ? rotateVector(gravity.vector, m_vector)[axis]
      : this.direction;

    // Acceleration Phase
    if (this.direction !== 0) {
      velocity[axis] += this.acceleration * actualDirection * deltaTime;

      // rotate sprite horizontally
      sprite.scale.x = this.direction;

      this.moving = true;
      this.onEvent('move');

      // Deceleration Phase
    } else if (velocity[axis] !== 0) {
      // prettier-ignore
      const dec = Math.min(Math.abs(velocity[axis]), this.deceleration * deltaTime);
      velocity[axis] += velocity[axis] > 0 ? -dec : dec;
    }

    if (this.moving && velocity[axis] === 0) {
      this.moving = false;
      this.onEvent('stop');
    }

    velocity[axis] *= this.dragFactor;
  }
}

export default Move;
