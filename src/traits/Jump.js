import Trait from '@traits/Trait';
import Sound from '@models/Sound';
import {EDGE} from '@models/PhysicsEngine';
import Force from '@models/Force';
import Vector from '@models/Vector';

class Jump extends Trait {
  constructor({physics}) {
    super('jump');
    this.physics = physics;
    this.velocity = new Force(0, -1, {
      strength: 100,
      dexterity: 0.6
    });

    this.ready = 0;
    this.requestTime = 0;
    this.engageTime = 0;

    this.pluckSound = new Sound('pluck');
    this.jumpSound = new Sound('jump');

    // parameters
    this.duration = 0.1;
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
      const rotatedTop = this.physics.rotateVector(new Vector(0, -1));
      this.velocity.applyTo(entity.vel);
      this.velocity.setForce(rotatedTop.x, rotatedTop.y);
      this.engageTime -= deltaTime;
    }

    this.ready -= 1;
  }

  obstruct(entity, edge) {
    const rotatedEdge = this.physics.rotateEdge(edge);
    if (rotatedEdge === EDGE.BOTTOM) {
      if (this.ready < 0) {
        this.pluckSound.play();
      }
      this.ready = 1;
    } else if (rotatedEdge === EDGE.TOP) {
      this.cancel();
    }
  }
}

export default Jump;
