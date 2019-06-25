import {lerp} from '@utils/math';
import Trait from '@traits/Trait';
import Vector from '@models/Vector';

class Move extends Trait {
  constructor(global, {}) {
    super('move');
    this.physics = global.level.physics;
    this.direction = 0;

    // parameters
    this.acceleration = 500;
    this.deceleration = 300;
    this.dragFactor = 0.95;
    this.alignThreshold = 0.65;
  }

  forward() {
    this.direction = 1;
  }

  backward() {
    this.direction = -1;
  }

  stop() {
    this.direction = 0;
  }

  update(entity, deltaTime) {
    const vector = this.physics.rotateVector(new Vector(this.direction, 0));
    const axis = this.physics.gravity.vertical ? 'x' : 'y';
    const velocity = entity.vel[axis];
    const absolute = Math.abs(velocity);

    if (this.direction !== 0) {
      entity.vel[axis] += this.acceleration * deltaTime * vector[axis];
    } else if (velocity !== 0) {
      const deceleration = Math.min(absolute, this.deceleration * deltaTime);
      entity.vel[axis] += velocity > 0 ? -deceleration : deceleration;
    }

    entity.vel[axis] *= this.dragFactor;
  }

  obstruct(entity) {
    if (this.direction !== 0) {
      return;
    }
    const axis = this.physics.gravity.vertical ? 'x' : 'y';
    const base = entity.pos[axis] / entity.size;

    const n = Math.abs(base) % 1;
    const align = (n < 0.5 ? 1 - n : n) * 2 - 1;

    if (align > this.alignThreshold) {
      const aligned = Math.round(base) * entity.size;
      entity.pos[axis] = lerp(entity.pos[axis], aligned, 0.2);

      // to compensate lerp error
      if (align > 0.99) {
        entity.pos[axis] = aligned;
      }
    }
  }
}

export default Move;
