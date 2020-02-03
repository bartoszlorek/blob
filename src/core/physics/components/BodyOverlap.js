// @flow strict

import Component from '@core/physics/Component';
import {EDGE} from '@core/physics/constants';

import type {EdgeType} from '@core/physics/constants';
import type Body from '@core/physics/Body';
import type Group from '@core/physics/Group';

type PropsType = {
  bodyA: Body,
  bodyB: Body | Group,
  callback: (body: Body, body: Body, edge: EdgeType) => mixed,
};

class BodyOverlap extends Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
  }

  update() {
    const {bodyA, bodyB, callback} = this.props;

    if (bodyB.isGroup) {
      // $FlowFixMe class-disjoint-unions
      bodyB.forEach(child => {
        if (bodyA.intersects(child)) {
          callback(bodyA, child, this.getOverlapingEdge(bodyA, child));
        }
      });
    } else {
      // $FlowFixMe class-disjoint-unions
      if (bodyA.intersects(bodyB)) {
        // $FlowFixMe class-disjoint-unions
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
