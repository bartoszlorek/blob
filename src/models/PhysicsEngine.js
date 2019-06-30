import {arrayForEach} from '@utils/array';
import {calculateGravity, closestSolidInDirection} from '@models/physics';
import {modIndex} from '@utils/math';
import Bounds from '@models/Bounds';
import Force from '@models/Force';

const shadowColor = 0xdaeaf2;
const maxShadowDistance = 5;

export const EDGE = {
  TOP: Symbol('top'),
  RIGHT: Symbol('right'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left')
};

class PhysicsEngine {
  constructor() {
    this.gravity = new Force(0, 1, {
      strength: 25,
      dexterity: 0.6
    });
    this.solids = [];
    this.bounds = null;
  }

  get rotation() {
    const {direction} = this.gravity;

    if (direction.y < 0) {
      return Math.PI;
    }
    if (direction.x > 0) {
      return (3 * Math.PI) / 2;
    }
    if (direction.x < 0) {
      return Math.PI / 2;
    }
    return 0;
  }

  addSolids(layer) {
    this.solids.push(layer.entities);
    this.updateBounds();
  }

  updateBounds() {
    this.bounds = new Bounds();
    this.bounds.merge(...this.solids.map(e => e.bounds()));
  }

  applyGravity(entity) {
    this.gravity.applyTo(entity.velocity);
  }

  calculateGravity(entity) {
    if (this.solids.length === 0) {
      return;
    }
    const gravity = calculateGravity({
      entity,
      solids: this.solids,
      bounds: this.bounds
    });

    if (gravity) {
      this.gravity.apply(gravity.x, gravity.y);
    }
  }

  applyCollisionX(entity) {
    arrayForEach(this.solids, entities => {
      entities.forEach(other => {
        if (!entity.intersection(other)) {
          return;
        }
        if (entity.velocity.x > 0) {
          if (entity.right > other.left) {
            entity.obstruct(EDGE.RIGHT, other);
          }
        } else if (entity.velocity.x < 0) {
          if (entity.left < other.right) {
            entity.obstruct(EDGE.LEFT, other);
          }
        }
      });
    });
  }

  applyCollisionY(entity) {
    arrayForEach(this.solids, entities => {
      entities.forEach(other => {
        if (!entity.intersection(other)) {
          return;
        }
        if (entity.velocity.y > 0) {
          if (entity.bottom > other.top) {
            entity.obstruct(EDGE.BOTTOM, other);
          }
        } else if (entity.velocity.y < 0) {
          if (entity.top < other.bottom) {
            entity.obstruct(EDGE.TOP, other);
          }
        }
      });
    });
  }

  rotateVector(vector) {
    const {direction} = this.gravity;
    const {x, y} = vector;

    if (direction.y < 0) {
      vector.x = -x;
      vector.y = -y;
    } else if (direction.x > 0) {
      vector.x = y;
      vector.y = -x;
    } else if (direction.x < 0) {
      vector.x = -y;
      vector.y = x;
    }
    return vector;
  }

  rotateEdge(edge) {
    const table = Object.values(EDGE);
    const index = table.indexOf(edge);
    const {direction} = this.gravity;

    let shift = 0;
    if (direction.x < 0) {
      shift = 1;
    } else if (direction.y < 0) {
      shift = 2;
    } else if (direction.x > 0) {
      shift = 3;
    }
    const rotatedIndex = modIndex(index - shift, 4);
    return table[rotatedIndex];
  }

  dropShadow(entity) {
    const {entity: other, dist} = closestSolidInDirection({
      entity,
      solids: this.solids,
      direction: this.gravity.direction
    });

    if (other && other.colorful && dist <= maxShadowDistance) {
      other.colorful.setColor(shadowColor);
    }
  }
}

export default PhysicsEngine;
