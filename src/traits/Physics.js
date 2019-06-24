import Trait from '@traits/Trait';
import {EDGE} from '@models/PhysicsEngine';

class Physics extends Trait {
  constructor() {
    super('physics');
  }

  update(entity, deltaTime) {
    const {physics} = entity.ownerLevel;

    physics.calculateGravity(entity);
    physics.applyGravity(entity);

    entity.pos.x += entity.vel.x * deltaTime;
    physics.applyCollisionX(entity);

    entity.pos.y += entity.vel.y * deltaTime;
    physics.applyCollisionY(entity);
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
