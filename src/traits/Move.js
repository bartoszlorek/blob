import Trait from '@traits/Trait';

class Move extends Trait {
  constructor() {
    super('move');
    this.dir = 0;
    this.acceleration = 500;
    this.deceleration = 300;
    this.dragFactor = 0.95;
  }

  update(entity, deltaTime) {
    const absX = Math.abs(entity.vel.x);

    if (this.dir !== 0) {
      entity.vel.x += this.acceleration * deltaTime * this.dir;
    } else if (entity.vel.x !== 0) {
      const deceleration = Math.min(absX, this.deceleration * deltaTime);
      entity.vel.x += entity.vel.x > 0 ? -deceleration : deceleration;
    }

    entity.vel.x *= this.dragFactor;
  }
}

export default Move;
