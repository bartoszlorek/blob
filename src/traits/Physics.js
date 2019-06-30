import Trait from '@traits/Trait';
import {EDGE} from '@models/PhysicsEngine';

class Physics extends Trait {
  constructor({physics}) {
    super('physics');
    this.physics = physics;
  }

  update(entity, deltaTime) {
    this.physics.calculateGravity(entity);
    this.physics.applyGravity(entity);

    entity.sprite.x += entity.velocity.x * deltaTime;
    this.physics.applyCollisionX(entity);

    entity.sprite.y += entity.velocity.y * deltaTime;
    this.physics.applyCollisionY(entity);

    // effects
    this.physics.dropShadow(entity);
  }

  obstruct(entity, edge, other) {
    switch (edge) {
      case EDGE.BOTTOM:
        entity.bottom = other.top;
        entity.velocity.y = 0;
        break;

      case EDGE.TOP:
        entity.top = other.bottom;
        entity.velocity.y = 0;
        break;

      case EDGE.LEFT:
        entity.left = other.right;
        entity.velocity.x = 0;
        break;

      case EDGE.RIGHT:
        entity.right = other.left;
        entity.velocity.x = 0;
        break;
    }
  }
}

export default Physics;
