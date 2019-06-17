import {arrayForEach} from '@utils/array';
import {EDGE} from '@models/Entity';
import Trait from '@traits/Trait';

const CORNER_ALIGN_THRESHOLD = 2;

class Physics extends Trait {
  constructor() {
    super('physics');
  }

  update(entity, deltaTime) {
    const {physics} = entity.ownerLevel;

    entity.pos.x += entity.vel.x * deltaTime;
    this.checkCollisionX(entity, entity.vel.x);

    entity.pos.y += entity.vel.y * deltaTime;
    this.checkCollisionY(entity, entity.vel.y);

    physics.applyGravity(entity, deltaTime);
  }

  checkCollisionX(entity, x) {
    const {physics} = entity.ownerLevel;

    arrayForEach(physics.rigidBodies, layer => {
      layer.entities.forEach(other => {
        if (!entity.intersection(other)) {
          return;
        }
        if (x > 0) {
          if (entity.right > other.left) {
            entity.obstruct(EDGE.RIGHT, other);
          }
        } else if (x < 0) {
          if (entity.left < other.right) {
            entity.obstruct(EDGE.LEFT, other);
          }
        }
      });
    });
  }

  checkCollisionY(entity, y) {
    const {physics} = entity.ownerLevel;

    arrayForEach(physics.rigidBodies, layer => {
      layer.entities.forEach(other => {
        if (!entity.intersection(other)) {
          return;
        }
        if (y > 0) {
          if (entity.bottom > other.top) {
            entity.obstruct(EDGE.BOTTOM, other);
          }
        } else if (y < 0) {
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

  obstruct(entity, edge, match) {
    switch (edge) {
      case EDGE.BOTTOM:
        entity.bottom = match.top;
        entity.vel.y = 0;
        break;

      case EDGE.TOP:
        entity.top = match.bottom;
        entity.vel.y = 0;
        break;

      case EDGE.LEFT:
        entity.left = match.right;
        entity.vel.x = 0;
        break;

      case EDGE.RIGHT:
        entity.right = match.left;
        entity.vel.x = 0;
        break;
    }
  }

  shouldAlignPositions(entity, other) {
    return (
      entity.left - other.right < CORNER_ALIGN_THRESHOLD &&
      entity.right - other.left < CORNER_ALIGN_THRESHOLD
    );
  }
}

export default Physics;
