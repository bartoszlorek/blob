import Trait from '@traits/Trait';
import Sound from '@models/Sound';
import {EDGE} from '@models/PhysicsEngine';

class Jump extends Trait {
  constructor() {
    super('jump');
    this.velocity = 200;
    this.duration = 0.3;
    this.gracePeriod = 0.1; // jump again before landing

    this.ready = 0;
    this.requestTime = 0;
    this.engageTime = 0;

    this.pluckSound = new Sound('pluck');
    this.jumpSound = new Sound('jump');
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
      entity.vel.y = -this.velocity;
      this.engageTime -= deltaTime;
    }

    this.ready -= 1;
  }

  obstruct(entity, edge) {
    if (edge === EDGE.BOTTOM) {
      if (this.ready < 0) {
        this.pluckSound.play();
      }
      this.ready = 1;
    } else if (edge === EDGE.TOP) {
      this.cancel();
    }
  }
}

export default Jump;
