import Trait from '@traits/Trait';
import Sound from '@models/Sound';
import {EDGE} from '@models/PhysicsEngine';

class Jump extends Trait {
  constructor(physics) {
    super('jump');

    if (!physics) {
      throw 'Trait `jump` requires Physics Engine';
    }
    this.physics = physics;
    this.ready = 0;
    this.requestTime = 0;
    this.engageTime = 0;

    this.pluckSound = new Sound('pluck');
    this.jumpSound = new Sound('jump');

    // parameters
    this.velocity = 200;
    this.duration = 0.3;
    this.gracePeriod = 0.1; // able to jump again before landing
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.requestTime = 0;
    this.engageTime = 0;
  }

  update(entity, deltaTime) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = this.duration;
        this.requestTime = 0;
      }
      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      if (this.ready === 1) {
        this.jumpSound.play();
      }
      const {direction, vertical} = this.physics.gravity;
      const invert = direction.y < 0 || direction.x < 0;
      const axis = vertical ? 'y' : 'x';

      entity.vel[axis] = invert ? this.velocity : -this.velocity;
      this.engageTime -= deltaTime;
    }

    this.ready -= 1;
  }

  obstruct(entity, edge) {
    const {direction} = this.physics.gravity;

    const obstructedFromTop =
      (direction.y > 0 && edge === EDGE.TOP) ||
      (direction.y < 0 && edge === EDGE.BOTTOM) ||
      (direction.x > 0 && edge === EDGE.LEFT) ||
      (direction.x < 0 && edge === EDGE.RIGHT);

    const obstructedFromBottom =
      (direction.y > 0 && edge === EDGE.BOTTOM) ||
      (direction.y < 0 && edge === EDGE.TOP) ||
      (direction.x > 0 && edge === EDGE.RIGHT) ||
      (direction.x < 0 && edge === EDGE.LEFT);

    if (obstructedFromBottom) {
      if (this.ready < 0) {
        this.pluckSound.play();
      }
      this.ready = 1;
    } else if (obstructedFromTop) {
      this.cancel();
    }
  }
}

export default Jump;
