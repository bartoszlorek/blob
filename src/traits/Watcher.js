import Trait from '@traits/Trait';
import {EDGE} from '@models/PhysicsEngine';

class Watcher extends Trait {
  constructor({global, physics, direction = 1, speed}) {
    super('watcher');
    this.global = global;
    this.physics = physics;
    this.direction = direction;
    this.speed = speed;
  }

  update(entity) {
    // todo: multiple layers and axis
    const closest = this.physics.passiveColliders[0].closest(
      entity.gridX,
      entity.gridY
    );
    const bottom = closest && closest[7];

    if (!bottom) {
      return entity.remove();
    }
    const beforeEdge = !closest[7 + this.direction];

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
    entity.velocity.x = this.direction * this.speed;
  }

  obstruct(entity, edge) {
    switch (edge) {
      case EDGE.LEFT:
      case EDGE.RIGHT:
        this.turnBack(entity);
        break;
    }
  }

  collide(entity, other) {
    if (other.parent.name === 'player') {
      if (other.velocity.y > 100) {
        entity.remove();
      } else {
        // restart the current level
        this.global.events.publish('player_dead');
        // other.animation.play('dead');
        other.remove();
      }
    }
  }

  turnBack(entity) {
    this.direction = -this.direction;
    entity.sprite.scale.x = this.direction;
  }
}

export default Watcher;
