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

class BodyCollision extends Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
  }

  update() {
    const {bodyA, bodyB, callback} = this.props;

    if (bodyB.isGroup === true) {
      bodyB.forEach(child => {
        if (bodyA.intersects(child)) {
          callback(bodyA, child, this.applyCollision(bodyA, child));
        }
      });
    } else {
      if (bodyA.intersects(bodyB)) {
        callback(bodyA, bodyB, this.applyCollision(bodyA, bodyB));
      }
    }
  }

  applyCollision(bodyA: Body, bodyB: Body) {
    const diffX = bodyA.min[0] - bodyB.min[0];
    const diffY = bodyA.min[1] - bodyB.min[1];

    if (diffX === diffY) {
      return 0;
    }

    if (Math.abs(diffX) > Math.abs(diffY)) {
      bodyA.velocity[0] = 0;

      if (diffX < 0) {
        bodyA.alignX(bodyB.min[0] - bodyA.width);
        return EDGE.RIGHT;
      } else {
        bodyA.alignX(bodyB.max[0]);
        return EDGE.LEFT;
      }
    } else {
      bodyA.velocity[1] = 0;

      if (diffY < 0) {
        bodyA.alignY(bodyB.min[1] - bodyA.height);
        return EDGE.BOTTOM;
      } else {
        bodyA.alignY(bodyB.max[1]);
        return EDGE.TOP;
      }
    }
  }
}

export default BodyCollision;
