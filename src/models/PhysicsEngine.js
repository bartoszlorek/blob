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
    this.activeColliders = [];
    this.passiveColliders = [];
    this.gravitation = [];
  }

  addCollision(layer) {
    if (layer.passive) {
      this.passiveColliders.push(layer);
    } else {
      this.activeColliders.push(layer);
    }
  }
  addGravitation(layer) {
    this.gravitation.push(layer);
  }

  update(deltaTime) {
    const {length} = this.activeColliders;

    for (let a = 0; a < length; a++) {
      const {children} = this.activeColliders[a];
      let index = children.length;

      while (0 < index--) {
        const entity = children[index];

        // apply passive collision
        if (entity.velocity.x !== 0) {
          entity.sprite.x += entity.velocity.x * deltaTime;
          this.applyPassiveCollisionX(entity);
        }
        if (entity.velocity.y !== 0) {
          entity.sprite.y += entity.velocity.y * deltaTime;
          this.applyPassiveCollisionY(entity);
        }

        // apply active collision
        for (let b = a + 1; b < length; b++) {
          const others = this.activeColliders[b].children;
          this.applyActiveCollision(entity, others);
        }

        // todo: self-collision
      }
    }
  }

  applyActiveCollision(entity, others) {
    let index = others.length;

    while (0 < index--) {
      const other = others[index];
      if (entity.intersection(other)) {
        entity.collide(other);
        other.collide(entity);
      }
    }
  }

  applyPassiveCollisionX(entity) {
    let layer = this.passiveColliders.length;
    let index = 0;

    while (0 < layer--) {
      const closest = this.passiveColliders[layer].closest(
        entity.gridX,
        entity.gridY
      );

      index = closest ? closest.length : 0;

      while (0 < index--) {
        const match = closest[index];

        if (!match || !entity.intersection(match)) {
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
    }
  }

  applyPassiveCollisionY(entity) {
    let layer = this.passiveColliders.length;
    let index = 0;

    while (0 < layer--) {
      const closest = this.passiveColliders[layer].closest(
        entity.gridX,
        entity.gridY
      );

      index = closest ? closest.length : 0;

      while (0 < index--) {
        const match = closest[index];

        if (!match || !entity.intersection(match)) {
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
    }
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

  dropShadow(entity) {
    // todo: multiple objects
    const {x, y} = entity.physics.gravity.direction;
    const match = this.gravitation[0].closestInDirection(
      entity.gridX,
      entity.gridY,
      x,
      y,
      maxShadowDistance
    );

    if (match && match.colorful) {
      match.colorful.setColor(shadowColor);
    }
  }
}

export default PhysicsEngine;
