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
  ready: boolean;
  requestTime: number;
  engageTime: number;

  duration: number;
  gracePeriod: number;

  constructor() {
    super('jump');

    this.force = new Force(0, -1, {
      str: 80,
      dex: 0.6,
    });

    this.ready = false;
    this.requestTime = 0;
    this.engageTime = 0;

    // parameters
    this.duration = 0.1;

    // it allows to make another jump when the user
    // presses a button in short time before landing
    this.gracePeriod = 0.1;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.requestTime = 0;
    this.engageTime = 0;
  }

  update(body: Body, deltaTime: number) {
    if (this.requestTime > 0) {
      this.requestTime -= deltaTime;

      if (this.ready) {
        this.engageTime = this.duration;
        this.requestTime = 0;
        this.ready = false;
        this.onEvent('jump');
      }
    }

    if (this.engageTime > 0) {
      const direction = this.getJumpDirection(body);
      this.force.applyDirection(direction);
      this.force.applyTo(body.velocity);
      this.engageTime -= deltaTime;
    }
  }

  collide(body: Body, edge: EdgeType) {
    if (this.ready) {
      return;
    }
    const rotatedEdge = body.gravity
      ? rotateEdge(body.gravity.vector, edge)
      : EDGE.BOTTOM;

    if (rotatedEdge === EDGE.BOTTOM) {
      // after landing we should set jumping force without
      // lerp to align next jump with the surface immediately
      const direction = this.getJumpDirection(body);
      Vector.copy(this.force.vector, direction);

      this.ready = true;
      this.onEvent('landing');
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
