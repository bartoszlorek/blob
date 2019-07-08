import Trait from '@traits/Trait';
import {EDGE} from '@models/PhysicsEngine';

class Watcher extends Trait {
  constructor({physics, speed}) {
    super('watcher');
    this.physics = physics;
    this.speed = speed;
  }

  update(entity, deltaTime) {
    // todo: multiple layers and axis
    const closest = this.physics.collision[0].closest(
      entity.gridX,
      entity.gridY
    );
    const bottom = closest && closest[7];

    if (!bottom) {
      entity.parent.willChange(entity, true);
      return;
    }
    const beforeEdge = !closest[7 + entity.velocity.x];

    if (beforeEdge) {
      if (entity.velocity.x > 0) {
        if (entity.right > bottom.right) {
          this.turnBack(entity);
        }
      } else if (entity.velocity.x < 0) {
        if (entity.left < bottom.left) {
          this.turnBack(entity);
        }
      }
    }

    // finally, apply movement
    entity.parent.willChange(entity);
    entity.sprite.x += entity.velocity.x * this.speed * deltaTime;
    this.physics.applyCollisionX(entity);
  }

  obstruct(entity, edge) {
    switch (edge) {
      case EDGE.LEFT:
      case EDGE.RIGHT:
        this.turnBack(entity);
        break;
    }
  }

  turnBack(entity) {
    entity.velocity.x = -entity.velocity.x;
    entity.sprite.scale.x = entity.velocity.x;
  }
}

export default Watcher;
