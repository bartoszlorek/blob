import {arrayForEach} from '@utils/array';
import {mergeBounds} from '@utils/bounds';
import Raycast from '@models/Raycast';
import Force from '@models/Force';

export const EDGE = {
  TOP: Symbol('top'),
  RIGHT: Symbol('right'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left')
};

// direction:
// [ 0,  1 ] bottom
// [ 0, -1 ] top
// [ 1,  0 ] right
// [-1,  0 ] left

class PhysicsEngine {
  constructor() {
    this.gravity = new Force({x: 0, y: 1}, 25);
    this.solids = [];
    this.bounds = null;
  }

  addSolids(layer) {
    this.solids.push(layer);
    this.updateBounds();
  }

  updateBounds() {
    this.bounds = mergeBounds(
      ...this.solids.map(layer => layer.entities.bounds())
    );
  }

  applyGravity(entity) {
    this.gravity.applyTo(entity.vel);
  }

  calculateGravityDirection(entity) {
    if (this.solids.length === 0) {
      return;
    }

    // outside bounds
    if (entity.bottom < this.bounds.top) {
      this.gravity.setForce(0, 1);
    } else if (entity.top > this.bounds.bottom) {
      this.gravity.setForce(0, -1);
    } else if (entity.right < this.bounds.left) {
      this.gravity.setForce(1, 0);
    } else if (entity.left > this.bounds.right) {
      this.gravity.setForce(-1, 0);
    }

    // const raycast = new Raycast(entity.ownerGlobal, this.solids, this.bounds);
    // const top = raycast.scan(entity.pos, new Vector(0, -1));
    // const right = raycast.scan(entity.pos, new Vector(1, 0));
    // const bottom = raycast.scan(entity.pos, new Vector(0, 1));
    // const left = raycast.scan(entity.pos, new Vector(-1, 0));

    // console.log({top, right, bottom, left});
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
}

export default PhysicsEngine;
