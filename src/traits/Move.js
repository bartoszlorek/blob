import {baseSize} from '@app/consts';
import {rotateVector} from '@utils/physics';
import {lerp} from '@utils/math';
import Trait from '@traits/Trait';
import Vector from '@models/Vector';

class Move extends Trait {
  constructor() {
    super('move');
    this.direction = 0;

    // parameters
    this.acceleration = 650;
    this.deceleration = 300;
    this.dragFactor = 0.95;
    this.alignThreshold = 0.65;
  }

  forward() {
    this.direction += 1;
  }

  backward() {
    this.direction -= 1;
  }

  update(body, deltaTime) {
    const vector = rotateVector(body.gravity, new Vector(this.direction, 0));

    const axis = body.gravity.vertical ? 'x' : 'y';
    const velocity = body.velocity[axis];
    const absolute = Math.abs(velocity);

    if (this.direction !== 0) {
      body.velocity[axis] += this.acceleration * deltaTime * vector[axis];

      // rotate sprite horizontally
      // body.sprite.scale.x = this.direction;
    } else if (velocity !== 0) {
      const deceleration = Math.min(absolute, this.deceleration * deltaTime);
      body.velocity[axis] += velocity > 0 ? -deceleration : deceleration;
    }

    body.velocity[axis] *= this.dragFactor;
  }

  collide(edge, body, tiles) {
    return;
    if (this.direction !== 0) {
      return;
    }
    const {position} = body;
    const axis = body.gravity.vertical ? 'x' : 'y';
    const base = position[axis] / baseSize;

    const n = Math.abs(base) % 1;
    const align = (n < 0.5 ? 1 - n : n) * 2 - 1;

    if (align > this.alignThreshold) {
      const aligned = Math.round(base) * baseSize;
      position[axis] = lerp(position[axis], aligned, 0.2);

      // to compensate lerp error
      if (align > 0.99) {
        position[axis] = aligned;
      }
    }
  }
}

export default Move;
