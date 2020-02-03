// @flow strict

import Action from '@core/Action';
import {EDGE} from '@core/physics/constants';

import type {EdgeType} from '@core/physics/constants';
import type Scene from '@core/Scene';
import type Body from '@core/physics/Body';

class Watcher extends Action {
  scene: Scene;
  direction: number;
  speed: number;

  constructor(scene: Scene, speed: number = 1, direction: number = 1) {
    super('watcher');
    this.scene = scene;
    this.direction = direction;
    this.speed = speed;
  }

  update(entity: Body, deltaTime: number) {
    const {ground} = (this.scene && this.scene.refs) || {};
    const closest = ground.closest(entity.gridX, entity.gridY);
    const bottom = closest && closest[7];

    if (!bottom) {
      return entity.destroy();
    }

    const beforeEdge = !closest[7 + this.direction];

    if (beforeEdge) {
      if (entity.velocity[0] > 0) {
        if (entity.max[0] > bottom.maxX) {
          this.turnBack(entity);
        }
      } else if (entity.velocity[0] < 0) {
        if (entity.min[0] < bottom.minX) {
          this.turnBack(entity);
        }
      }
    }

    // finally, apply movement
    entity.velocity[0] = this.direction * this.speed;
    entity.sprite.x += entity.velocity[0] * deltaTime;
  }

  collide(entity: Body, edge: EdgeType) {
    switch (edge) {
      case EDGE.LEFT:
      case EDGE.RIGHT:
        this.turnBack(entity);
        return;
    }
  }

  turnBack(entity: Body) {
    this.direction = -this.direction;
    entity.sprite.scale.x = this.direction;
  }
}

export default Watcher;
