import Trait from '@traits/Trait';
import Vector from '@models/Vector';

class Move extends Trait {
  constructor(physics) {
    super('move');

    if (!physics) {
      throw 'Trait `move` requires Physics Engine';
    }
    this.physics = physics;
    this.direction = 0;

    // parameters
    this.acceleration = 500;
    this.deceleration = 300;
    this.dragFactor = 0.95;
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
}

export default Move;
