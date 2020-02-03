// @flow strict

import Component from '@core/physics/Component';
import {EDGE} from '@core/physics/constants';

import type {EdgeType} from '@core/physics/constants';
import type Body from '@core/physics/Body';
import type BodyGroup from '@core/physics/BodyGroup';

type PropsType = {
  bodyA: Body,
  bodyB: Body | BodyGroup,
  callback: (body: Body, body: Body, edge: EdgeType) => mixed,
};

class BodyOverlap extends Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
  }

  update() {
    const {bodyA, bodyB, callback} = this.props;

    if (bodyB.isGroup === true) {
      bodyB.forEach(child => {
        if (bodyA.intersects(child)) {
          callback(bodyA, child, this.getOverlapingEdge(bodyA, child));
        }
      });
    } else {
      if (bodyA.intersects(bodyB)) {
        callback(bodyA, bodyB, this.getOverlapingEdge(bodyA, bodyB));
      }
    }
  }

  getOverlapingEdge(bodyA: Body, bodyB: Body) {
    const diffX = bodyA.min[0] - bodyB.min[0];
    const diffY = bodyA.min[1] - bodyB.min[1];

    if (diffX === diffY) {
      return 0;
    }
    if (Math.abs(diffX) > Math.abs(diffY)) {
      return diffX < 0 ? EDGE.RIGHT : EDGE.LEFT;
    } else {
      return diffY < 0 ? EDGE.BOTTOM : EDGE.TOP;
    }
  }
}

export default BodyOverlap;
