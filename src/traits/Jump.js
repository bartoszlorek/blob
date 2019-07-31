import {rotateEdge, rotateVector} from '@utils/physics';
import Trait from '@traits/Trait';

import {EDGE} from '@physics/World';
import Sound from '@models/Sound';
import Force from '@models/Force';
import Vector from '@models/Vector';

class Jump extends Trait {
  constructor() {
    super('jump');

    this.force = new Force(0, -1, {
      strength: 100,
      dexterity: 0.6
    });

    this.ready = 0;
    this.requestTime = 0;
    this.engageTime = 0;

    // parameters
    this.duration = 0.1;
    this.gracePeriod = 0.1; // jump again before landing

    // sounds
    this.jumpSound = new Sound('jump_01', 'jump_02', 'jump_03', 'jump_04');
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
        this.jumpSound.playSequence();
      }
      const {x, y} = this._direction(entity);
      this.force.apply(x, y);
      this.force.applyTo(entity.velocity);
      this.engageTime -= deltaTime;
    }

    this.ready -= 1;
  }

  collide(edge, body, tiles) {
    const rotatedEdge = rotateEdge(body.gravity, edge);

    if (rotatedEdge === EDGE.BOTTOM) {
      if (this.ready < 0) {
        // landing sounds
      }
      // reset jumping force
      const {x, y} = this._direction(body);
      this.force.set(x, y);
      this.ready = 1;
    } else if (rotatedEdge === EDGE.TOP) {
      this.cancel();
    }
  }

  _direction(body) {
    return rotateVector(body.gravity, new Vector(0, -1));
  }
}

export default Jump;
