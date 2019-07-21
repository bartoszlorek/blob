import Trait from '@traits/Trait';
import {EDGE} from '@models/PhysicsEngine';

class Watcher extends Trait {
  constructor({global, direction = 1, speed}) {
    super('watcher');
    this.global = global;
    this.direction = direction;
    this.speed = speed;
  }

  update(entity) {
    const {ground} = this.global.level.layers;
    const closest = ground.closest(entity.gridX, entity.gridY);
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

  collide(entity, other, edge) {
    // passive collision
    switch (edge) {
      case EDGE.LEFT:
      case EDGE.RIGHT:
        this.turnBack(entity);
        return;
    }

    // active collision
    if (other.parent.name === 'player') {
      if (other.velocity.y > 0) {
        entity.remove();
      } else {
        this.global.events.publish('player_dead');
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
