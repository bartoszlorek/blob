// @flow strict

import {baseSize} from '@app/constants';
import {rotateVector} from '@utils/physics';
import {lerp} from '@utils/math';

import Vector from '@core/physics/Vector';
import Trait from '@core/Trait';

import type {EdgeType} from '@core/physics/constants';
import type Body from '@core/physics/Body';

const alignmentMin = 0.65;
const alignmentMax = 0.99;

// mutable data
const m_vector = Vector.create();

class Move extends Trait {
  direction: number;

  acceleration: number;
  deceleration: number;
  dragFactor: number;

  constructor() {
    super('move');
    this.direction = 0;

    // parameters
    this.acceleration = 650;
    this.deceleration = 300;
    this.dragFactor = 0.95;
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

    if (this.direction !== 0) {
      velocity[axis] += this.acceleration * actualDirection * deltaTime;

      // rotate sprite horizontally
      sprite.scale.x = this.direction;
    } else if (velocity[axis] !== 0) {
      // prettier-ignore
      const dec = Math.min(Math.abs(velocity[axis]), this.deceleration * deltaTime);
      velocity[axis] += velocity[axis] > 0 ? -dec : dec;
    }

    velocity[axis] *= this.dragFactor;
  }

  collide(body: Body, edge: EdgeType) {
    if (this.direction !== 0) {
      return;
    }
    const {min: position, gravity} = body;
    const axis = gravity && Vector.isHorizontal(gravity.vector) ? 1 : 0;
    const base = position[axis] / baseSize;

    // fancy logic to calculate `alignment` [0-1]
    // 0 - body is exactly between two tiles
    // 1 - body is aligned with the closest tile
    const n = Math.abs(base) % 1;
    const alignment = (n < 0.5 ? 1 - n : n) * 2 - 1;

    if (alignment >= alignmentMin) {
      const tilePosition = Math.round(base) * baseSize;
      const lerpPosition = lerp(position[axis], tilePosition, 0.2);

      if (axis === 0) {
        body.alignX(lerpPosition);
      } else {
        body.alignY(lerpPosition);
      }

      if (alignment >= alignmentMax) {
        if (axis === 0) {
          body.alignX(tilePosition);
        } else {
          body.alignY(tilePosition);
        }
      }
    }
  }
}

export default Move;
