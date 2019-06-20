import Trait from '@traits/Trait';
import {EDGE} from '@models/PhysicsEngine';

class Physics extends Trait {
  constructor() {
    super('physics');
  }

  update(entity, deltaTime) {
    const {physics} = entity.ownerLevel;

    physics.calculateGravityDirection(entity);
    physics.applyGravity(entity);

    entity.pos.x += entity.vel.x * deltaTime;
    physics.applyCollisionX(entity);

    entity.pos.y += entity.vel.y * deltaTime;
    physics.applyCollisionY(entity);
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
}

export default Physics;
