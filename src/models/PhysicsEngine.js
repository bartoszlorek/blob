import {arrayForEach} from '@utils/array';
import {calculateGravity} from '@models/physics';

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
    this.gravitation = [];
    this.collision = [];
  }

  addGravitation(layer) {
    this.gravitation.push(layer);
  }

  addCollision(layer, selfCollision = false) {
    layer.selfCollision = selfCollision;
    this.collision.push(layer);
  }

  calculateGravity(gravity, entity) {
    if (this.gravitation.length === 0) {
      return;
    }
    const result = calculateGravity(entity, this.gravitation);

    if (result) {
      gravity.apply(result.x, result.y);
    }
  }

  applyGravity(gravity, entity) {
    gravity.applyTo(entity.velocity);
  }

  applyCollisionX(entity) {
    const {selfCollision} = entity.parent;

    arrayForEach(this.collision, layer => {
      if (!selfCollision && layer === entity.parent) {
        return;
      }
      const closest = layer.closest(entity.gridX, entity.gridY);
      const length = closest ? closest.length : 0;

      for (let index = 0; index < length; index++) {
        const match = closest[index];

        if (!match || entity === match || !entity.intersection(match)) {
          continue;
        }
        if (entity.velocity.x > 0) {
          if (entity.right > match.left) {
            entity.obstruct(EDGE.RIGHT, match);
          }
        } else if (entity.velocity.x < 0) {
          if (entity.left < match.right) {
            entity.obstruct(EDGE.LEFT, match);
          }
        }
      }
    });
  }

  applyCollisionY(entity) {
    const {selfCollision} = entity.parent;

    arrayForEach(this.collision, layer => {
      if (!selfCollision && layer === entity.parent) {
        return;
      }
      const closest = layer.closest(entity.gridX, entity.gridY);
      const length = closest ? closest.length : 0;

      for (let index = 0; index < length; index++) {
        const match = closest[index];

        if (!match || entity === match || !entity.intersection(match)) {
          continue;
        }
        if (entity.velocity.y > 0) {
          if (entity.bottom > match.top) {
            entity.obstruct(EDGE.BOTTOM, match);
          }
        } else if (entity.velocity.y < 0) {
          if (entity.top < match.bottom) {
            entity.obstruct(EDGE.TOP, match);
          }
        }
      }
    });
  }

  dropShadow(entity) {
    // todo: multiple objects
    const {x, y} = entity.physics.gravity.direction;
    const match = this.gravitation[0].closestInDirection(
      entity.gridX,
      entity.gridY,
      x,
      y
    );

    if (
      match &&
      match.colorful &&
      entity.distance(match) <= maxShadowDistance
    ) {
      match.colorful.setColor(shadowColor);
    }
  }
}

export default PhysicsEngine;
