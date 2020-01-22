import Action from '@core/interaction/Action';
import {EDGE} from '@core/physics/constants';

class Watcher extends Action {
  constructor({scene, direction = 1, speed}) {
    super('watcher');
    this.scene = scene;
    this.direction = direction;
    this.speed = speed;
  }

  update(entity, deltaTime) {
    const {ground} = this.scene.refs;
    const closest = ground.closest(entity.gridX, entity.gridY);
    const bottom = closest && closest[7];

    if (!bottom) {
      return entity.destroy();
    }

    const beforeEdge = !closest[7 + this.direction];

    if (beforeEdge) {
      if (entity.velocity.x > 0) {
        if (entity.maxX > bottom.maxX) {
          this.turnBack(entity);
        }
      } else if (entity.velocity.x < 0) {
        if (entity.minX < bottom.minX) {
          this.turnBack(entity);
        }
      }
    }

    // finally, apply movement
    entity.velocity.x = this.direction * this.speed;
    entity.position.x += entity.velocity.x * deltaTime;
  }

  collide(entity, other, edge) {
    switch (edge) {
      case EDGE.LEFT:
      case EDGE.RIGHT:
        this.turnBack(entity);
        return;
    }
  }

  turnBack(entity) {
    this.direction = -this.direction;
    entity.sprite.scale.x = this.direction;
  }
}

export default Watcher;
