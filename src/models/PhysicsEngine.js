import {arrayForEach} from '@utils/array';
import {calculateGravity} from '@models/physics/gravity';
import {modIndex} from '@utils/math';
import Bounds from '@models/Bounds';
import Force from '@models/Force';

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
      bias: 0.4
    });
    this.solids = [];
    this.bounds = null;
  }

  addSolids(layer) {
    this.solids.push(layer);
    this.updateBounds();
  }

  updateBounds() {
    this.bounds = new Bounds();
    this.bounds.merge(...this.solids.map(layer => layer.entities.bounds()));
  }

  applyGravity(entity) {
    this.gravity.applyTo(entity.vel);
  }

  calculateGravity(entity) {
    if (this.solids.length === 0) {
      return;
    }
    const gravity = calculateGravity({
      entity,
      layers: this.solids,
      bounds: this.bounds
    });

    if (gravity) {
      this.gravity.setForce(gravity.x, gravity.y);
    }
  }

  applyCollisionX(entity) {
    arrayForEach(this.solids, layer => {
      layer.entities.forEach(other => {
        if (!entity.intersection(other)) {
          return;
        }
        if (entity.vel.x > 0) {
          if (entity.right > other.left) {
            entity.obstruct(EDGE.RIGHT, other);
          }
        } else if (entity.vel.x < 0) {
          if (entity.left < other.right) {
            entity.obstruct(EDGE.LEFT, other);
          }
        }
      });
    });
  }

  applyCollisionY(entity) {
    arrayForEach(this.solids, layer => {
      layer.entities.forEach(other => {
        if (!entity.intersection(other)) {
          return;
        }
        if (entity.vel.y > 0) {
          if (entity.bottom > other.top) {
            entity.obstruct(EDGE.BOTTOM, other);
          }
        } else if (entity.vel.y < 0) {
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
}

export default PhysicsEngine;
