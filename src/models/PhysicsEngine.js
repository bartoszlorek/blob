import {calculateGravity} from '@models/physics';

const shadowColor = 0xdaeaf2;
const maxShadowDistance = 5;

const wrongCollision = type =>
  `The "${type}" layer type is not supported by collision.`;
const wrongGravitation = type =>
  `The "${type}" layer type is not supported by gravitation.`;

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
    switch (layer.type) {
      case 'passive':
        return this.passiveColliders.push(layer);
      case 'active':
        return this.activeColliders.push(layer);
      default:
        console.warn(wrongCollision(layer.type));
    }
  }

  addGravitation(layer) {
    switch (layer.type) {
      case 'passive':
        return this.gravitation.push(layer);
      default:
        console.warn(wrongGravitation(layer.type));
    }
  }

  update(deltaTime) {
    const {length} = this.activeColliders;

    for (let a = 0; a < length; a++) {
      const layer = this.activeColliders[a];
      const {children} = layer;
      let index = children.length;

      while (index > 0) {
        const entity = children[--index];

        // passive collision: compares each active
        // entity with all passive entities
        if (entity.velocity.x !== 0) {
          entity.sprite.x += entity.velocity.x * deltaTime;
          this._applyPassiveCollisionX(entity);
        }
        if (entity.velocity.y !== 0) {
          entity.sprite.y += entity.velocity.y * deltaTime;
          this._applyPassiveCollisionY(entity);
        }

        // active collisions: compares each active
        // entity with others active but ONLY ONCE
        for (let b = a + 1; b < length; b++) {
          const others = this.activeColliders[b].children;
          this._applyActiveCollision(entity, others);
        }

        // todo: self-collision
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

  _applyActiveCollision(entity, others) {
    let index = others.length;

    while (index > 0) {
      const other = others[--index];
      if (entity.intersection(other)) {
        entity.collide(other);
        other.collide(entity);
      }
    }
  }

  _applyPassiveCollisionX(entity) {
    let indexLayer = this.passiveColliders.length;
    let index = 0;

    while (indexLayer > 0) {
      const closest = this.passiveColliders[--indexLayer].closest(
        entity.gridX,
        entity.gridY
      );

      index = closest ? closest.length : 0;

      while (index > 0) {
        const match = closest[--index];

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

  _applyPassiveCollisionY(entity) {
    let indexLayer = this.passiveColliders.length;
    let index = 0;

    while (indexLayer > 0) {
      const closest = this.passiveColliders[--indexLayer].closest(
        entity.gridX,
        entity.gridY
      );

      index = closest ? closest.length : 0;

      while (index > 0) {
        const match = closest[--index];

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
}

export default PhysicsEngine;
