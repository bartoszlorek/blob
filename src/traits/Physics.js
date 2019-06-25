import Trait from '@traits/Trait';
import {EDGE} from '@models/PhysicsEngine';

class Physics extends Trait {
  constructor(global, {}) {
    super('physics');
    this.physics = global.level.physics;
  }

  update(entity, deltaTime) {
    this.physics.calculateGravity(entity);
    this.physics.applyGravity(entity);

    entity.pos.x += entity.vel.x * deltaTime;
    this.physics.applyCollisionX(entity);

    entity.pos.y += entity.vel.y * deltaTime;
    this.physics.applyCollisionY(entity);
  }

  obstruct(entity, edge, other) {
    switch (edge) {
      case EDGE.BOTTOM:
        entity.bottom = other.top;
        entity.vel.y = 0;
        break;

      case EDGE.TOP:
        entity.top = other.bottom;
        entity.vel.y = 0;
        break;

      case EDGE.LEFT:
        entity.left = other.right;
        entity.vel.x = 0;
        break;

      case EDGE.RIGHT:
        entity.right = other.left;
        entity.vel.x = 0;
        break;
    }
  }
}

export default Physics;
