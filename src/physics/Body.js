import Vector from '@models/Vector';

export const DYNAMIC_TYPE = Symbol('dynamic');
export const STATIC_TYPE = Symbol('static');

class Body {
  constructor(type = StaticType, sprite) {
    this.type = type;
    this.sprite = sprite;

    this.traits = [];
    this.parent = null;
    this.active = true;

    // in simulation
    this.velocity = new Vector(0, 0);
    this.position = new Vector(sprite.x, sprite.y);
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
      this.sprite.x = this.position.x;
      this.sprite.y = this.position.y;
    }
  }

  destroy() {
    this.active = false;

    if (this.parent) {
      this.parent.pendingDestroy.set(this);
    }
  }
}

export default Body;
