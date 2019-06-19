import Trait from '@traits/Trait';

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

  update(entity, deltaTime) {
    const {invertedAxis, gravity} = this.physics;
    const axis = gravity.vertical ? 'x' : 'y';

    const velocity = entity.vel[axis];
    const absolute = Math.abs(velocity);
    const direction = invertedAxis ? -this.direction : this.direction;

    if (direction !== 0) {
      entity.vel[axis] += this.acceleration * deltaTime * direction;
    } else if (velocity !== 0) {
      const deceleration = Math.min(absolute, this.deceleration * deltaTime);
      entity.vel[axis] += velocity > 0 ? -deceleration : deceleration;
    }

    entity.vel[axis] *= this.dragFactor;
  }
}

export default Move;
