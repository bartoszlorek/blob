import Trait from '@traits/Trait';
import Sound from '@models/Sound';
import {EDGE} from '@models/PhysicsEngine';
import Force from '@models/Force';
import Vector from '@models/Vector';

class Jump extends Trait {
  constructor(physics) {
    super('jump');

    if (!physics) {
      throw 'Trait `jump` requires Physics Engine';
    }
    this.physics = physics;
    this.velocity = new Force(0, -1, {
      strength: 50,
      bias: 0.6
    });

    this.ready = 0;
    this.requestTime = 0;
    this.engageTime = 0;

    this.pluckSound = new Sound('pluck');
    this.jumpSound = new Sound('jump');

    // parameters
    this.duration = 0.25;
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

      const up = this.physics.rotateVector(new Vector(0, -1));
      this.velocity.applyTo(entity.vel);
      this.velocity.setForce(up.x, up.y);
      this.engageTime -= deltaTime;
    }

    this.ready -= 1;
  }

  obstruct(entity, edge) {
    const {direction} = this.physics.gravity;

    // todo: rotate top edge
    // this.physics.rotateEdge(edge);

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
