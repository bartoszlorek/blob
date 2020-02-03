// @flow strict

import BoundingBox from '@core/BoundingBox';
import Vector from '@core/physics/Vector';

import type PIXI from 'pixi.js';
import type Trait from '@core/Trait';
import type World from '@core/physics/World';
import type Force from '@core/physics/Force';
import type {VectorType} from '@core/physics/Vector';

class Body extends BoundingBox {
  +isBody: true;
  +isGroup: false;
  +isTiles: false;
  +size: number;

  sprite: PIXI.Sprite;
  velocity: VectorType;
  gravity: Force | null;

  traits: Array<Trait>;
  trait: {[name: string]: any}; // todo: subtypes of Trait
  parent: World | null;
  alive: boolean;

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
    this.gravity = null;

    this.traits = [];
    this.trait = {};
    this.parent = null;
    this.alive = true;

    this.isBody = true;
    this.isGroup = false;
    this.isTiles = false;

    // process
    this.updateSprite();
  }

  update(deltaTime: number) {
    // update sprite to the position from the previous frame
    this.updateSprite();

    // traits phase
    for (let index = 0; index < this.traits.length; index++) {
      this.traits[index].update(this, deltaTime);
    }

    // apply velocity from the current frame to the bbox
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);
  }

  updateSprite() {
    this.sprite.position.x = this.min[0] + this.size / 2;
    this.sprite.position.y = this.min[1] + this.size / 2;
  }

  addAction(trait: Trait) {
    this.traits.push(trait);
    this.trait[trait.name] = trait;
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
