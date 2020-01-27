import Component from '@core/physics/Component';
import {EDGE} from '@core/physics/constants';

class BodyOverlap extends Component {
  constructor(props) {
    super(props);
  }

  update() {
    const {bodyA, bodyB, callback} = this.props;

    if (bodyB.isGroup) {
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

  getOverlapingEdge(bodyA, bodyB) {
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
