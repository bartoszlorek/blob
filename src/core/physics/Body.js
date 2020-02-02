// @flow strict

import BoundingBox from '@core/BoundingBox';
import Vector from '@core/physics/Vector';

import type PIXI from 'pixi.js';
import type Action from '@core/Action';
import type World from '@core/physics/World';
import type {VectorType} from '@core/physics/Vector';

class Body extends BoundingBox {
  sprite: PIXI.Sprite;
  size: number;
  velocity: VectorType;

  actions: Array<Action>;
  action: {[name: string]: Action};
  parent: World | null;
  isBody: true;
  isAlive: boolean;

  constructor(
    sprite: PIXI.Sprite,
    x: number = 0,
    y: number = 0,
    size: number = 32
  ) {
    super([x, y], [x + size, y + size]);

    // pixijs
    this.sprite = sprite;
    this.sprite.anchor.set(0.5);

    // props
    this.size = size;
    this.velocity = Vector.create(0, 0);
    this.actions = [];
    this.action = {};
    this.parent = null;

    // flags
    this.isBody = true;
    this.isAlive = true;

    // process
    this.updateSprite();
  }

  update(deltaTime: number) {
    // update sprite to the position from the previous frame
    this.updateSprite();

    // actions phase
    for (let index = 0; index < this.actions.length; index++) {
      this.actions[index].update(this, deltaTime);
    }

    // apply velocity from the current frame to the bbox
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);
  }

  updateSprite() {
    this.sprite.position.x = this.min[0] + this.size / 2;
    this.sprite.position.y = this.min[1] + this.size / 2;
  }

  addAction(action: Action) {
    this.actions.push(action);
    this.action[action.name] = action;
  }

  destroy() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  unsafeDestroy() {
    this.sprite.destroy();
    this.sprite = null;
    this.parent = null;
  }
}

export default Body;
