import {arrayForEach} from '@utils/array';
import Vector from '@utils/Vector';

const CORNER_ALIGN_THRESHOLD = 2;

export const EDGE = {
  TOP: Symbol('top'),
  RIGHT: Symbol('right'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left')
};

class PhysicsEngine {
  constructor(rigidBodies = []) {
    this.rigidBodies = rigidBodies;
    this.gravityForce = 25;
    this.gravityDirection = new Vector(0, 1);
    this.gravity = new Vector(0, 0);
  }

  addRigidBody(layer) {
    this.rigidBodies.push(layer);
  }

  applyGravity(entity) {
    entity.vel.x += this.gravityDirection.x * this.gravityForce;
    entity.vel.y += this.gravityDirection.y * this.gravityForce;
  }

  applyCollisionX(entity) {
    arrayForEach(this.rigidBodies, layer => {
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
    arrayForEach(this.rigidBodies, layer => {
      layer.entities.forEach(other => {
        if (!entity.intersection(other)) {
          return;
        }
        if (entity.vel.y > 0) {
          if (entity.bottom > other.top) {
            entity.obstruct(EDGE.BOTTOM, other);
          }
        } else if (entity.vel.y < 0) {
          // todo: check if it's still needed
          if (this.shouldAlignPositions(entity, other)) {
            entity.right = other.left;
          }
          if (entity.top < other.bottom) {
            entity.obstruct(EDGE.TOP, other);
          }
        }
      });
    });
  }

  shouldAlignPositions(entity, other) {
    return (
      entity.left - other.right < CORNER_ALIGN_THRESHOLD &&
      entity.right - other.left < CORNER_ALIGN_THRESHOLD
    );
  }
}

export default PhysicsEngine;
