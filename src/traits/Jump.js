import Trait from '@traits/Trait';
import Sound from '@models/Sound';
import {EDGE} from '@models/PhysicsEngine';
import Force from '@models/Force';
import Vector from '@models/Vector';

class Jump extends Trait {
  constructor({physics}) {
    super('jump');
    this.physics = physics;
    this.force = new Force(0, -1, {
      strength: 100,
      dexterity: 0.6
    });

    this.ready = 0;
    this.requestTime = 0;
    this.engageTime = 0;

    // parameters
    this.duration = 0.1;
    this.gracePeriod = 0.1; // able to jump again before landing

    // sounds
    this.pluckSound = new Sound('pluck');
    this.jumpSound = new Sound('jump');
  }

  get falling() {
    return this.ready < 0;
  }

  get direction() {
    return this.physics.rotateVector(new Vector(0, -1));
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
      const {x, y} = this.direction;
      this.force.apply(x, y);
      this.force.applyTo(entity.velocity);
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
      // reset jumping force
      const {x, y} = this.direction;
      this.force.set(x, y);
      this.ready = 1;
    } else if (rotatedEdge === EDGE.TOP) {
      this.cancel();
    }
  }
}

export default Jump;
