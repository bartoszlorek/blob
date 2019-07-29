import {baseSize} from '@app/consts';
import Vector from '@models/Vector';

export const DYNAMIC_TYPE = Symbol('dynamic');
export const STATIC_TYPE = Symbol('static');

class Body {
  constructor(sprite, type = DYNAMIC_TYPE) {
    this.sprite = sprite;
    this.type = type;

    this.traits = [];
    this.active = true;
    this.isBody = true;
    this.world = null;

    // in simulation
    this.velocity = new Vector(0, 0);
    this.position = new Vector(sprite.x, sprite.y);
  }

  get left() {
    return this.position.x;
  }

  get top() {
    return this.position.y;
  }

  get right() {
    return this.position.x + baseSize;
  }

  get bottom() {
    return this.position.y + baseSize;
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  update(deltaTime) {
    if (!this.active) {
      return;
    }
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    for (let i = 0; i < this.traits.length; i++) {
      this.traits[i].update(this, deltaTime);
    }
  }

  postUpdate() {
    if (this.active) {
      console.log('postUpdateBody');
      this.sprite.x = this.position.x;
      this.sprite.y = this.position.y;
    }
  }

  destroy() {
    this.active = false;

    if (this.world) {
      this.world.pendingDestroy.set(this);
    }
  }
}

export default Body;
