import {vectorRotation} from '@utils/physics';
import {EDGE} from '@models/PhysicsEngine';
import Force from '@models/Force';
import Trait from '@traits/Trait';

class Physics extends Trait {
  constructor({physics}) {
    super('physics');
    this.physics = physics;

    this.gravity = new Force(0, 1, {
      strength: 25,
      dexterity: 0.6
    });
  }

  update(entity, deltaTime) {
    entity.parent.willChange(entity);

    this.physics.calculateGravity(this.gravity, entity);
    this.physics.applyGravity(this.gravity, entity);

    entity.sprite.x += entity.velocity.x * deltaTime;
    this.physics.applyCollisionX(entity);

    entity.sprite.y += entity.velocity.y * deltaTime;
    this.physics.applyCollisionY(entity);

    entity.sprite.rotation = vectorRotation(this.gravity);

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
