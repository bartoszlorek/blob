import {rotateEdge, rotateVector} from '@utils/physics';
import Sound from '@core/Sound';
import Force from '@core/Force';
import Action from '@core/Action';
import Vector from '@core/Vector';

import {EDGE} from '@physics/consts';

const m_vector = Vector.create();

class Jump extends Action {
  constructor() {
    super('jump');

    this.force = new Force(0, -1, {
      str: 100,
      dex: 0.6,
    });

    this.ready = 1;
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

  update(body, deltaTime) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = this.duration;
        this.requestTime = 0;
      }
      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      if (this.ready === 1) {
        // jumping sound
        // this.jumpSound.playSequence();
      }
      const direction = this.getJumpDirection(body);
      this.force.applyDirection(direction);
      this.force.applyTo(body.velocity);

      this.engageTime -= deltaTime;
    }

    this.ready -= 1;
  }

  collide(body, edge) {
    const rotatedEdge = rotateEdge(body.gravity.vector, edge);

    if (rotatedEdge === EDGE.BOTTOM) {
      if (this.ready < 0) {
        // landing sounds
      }
      // after landing we should set jumping force without
      // lerp to align next jump with the surface immediately
      const direction = this.getJumpDirection(body);
      Vector.copy(this.force.vector, direction);

      this.ready = 1;
    } else if (rotatedEdge === EDGE.TOP) {
      this.cancel();
    }
  }

  getJumpDirection(body) {
    m_vector[0] = 0;
    m_vector[1] = -1;

    return rotateVector(body.gravity.vector, m_vector);
  }
}

export default Jump;
