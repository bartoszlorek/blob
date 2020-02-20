// @flow strict

import {rotateEdge, rotateVector} from '@utils/physics';
import Trait from '@core/Trait';
import Vector from '@core/physics/Vector';
import Force from '@core/physics/Force';
import {EDGE} from '@core/physics/constants';

import type {EdgeType} from '@core/physics/constants';
import type Body from '@core/physics/Body';

const m_vector = Vector.create();

class Jump extends Trait {
  force: Force;
  jumping: boolean;

  readyTime: number;
  requestTime: number;
  engageTime: number;

  gracePeriodBeforeLand: number;
  gracePeriodAfterFall: number;
  duration: number;

  constructor() {
    super('jump');

    this.force = new Force(0, -1, {
      str: 80,
      dex: 0.6,
    });

    this.jumping = false;
    this.readyTime = 0;
    this.requestTime = 0;
    this.engageTime = 0;

    // parameters
    this.gracePeriodBeforeLand = 0.1;
    this.gracePeriodAfterFall = 0.2;
    this.duration = 0.1;
  }

  start() {
    this.requestTime = this.gracePeriodBeforeLand;
  }

  cancel() {
    this.requestTime = 0;
    this.engageTime = 0;
  }

  update(body: Body, deltaTime: number) {
    if (this.requestTime > 0) {
      this.requestTime -= deltaTime;

      if (this.readyTime > 0) {
        this.engageTime = this.duration;
        this.requestTime = 0;
        this.readyTime = 0;

        this.jumping = true;
        this.onEvent('jump');
      }
    }

    if (this.engageTime > 0) {
      const direction = this.getJumpDirection(body);
      this.force.applyDirection(direction);
      this.force.applyTo(body.velocity);
      this.engageTime -= deltaTime;
    }

    this.readyTime -= deltaTime;
  }

  collide(body: Body, edge: EdgeType) {
    const rotatedEdge = body.gravity
      ? rotateEdge(body.gravity.vector, edge)
      : EDGE.BOTTOM;

    if (rotatedEdge === EDGE.BOTTOM) {
      if (this.readyTime < 0) {
        // align direction with surface after landing
        const direction = this.getJumpDirection(body);
        Vector.copy(this.force.vector, direction);

        this.jumping = false;
        this.onEvent('land');
      }

      this.readyTime = this.gracePeriodAfterFall;
    } else if (rotatedEdge === EDGE.TOP) {
      this.cancel();
    }
  }

  getJumpDirection(body: Body) {
    m_vector[0] = 0;
    m_vector[1] = -1;

    if (body.gravity) {
      return rotateVector(body.gravity.vector, m_vector);
    }
    return m_vector;
  }
}

export default Jump;
