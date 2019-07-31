import {baseSize} from '@app/consts';
import Vector from '@models/Vector';

class Body {
  constructor(sprite, type = 'static') {
    this.sprite = sprite;
    this.type = type;
    this.isBody = true;

    // parameters
    this.position = new Vector(sprite.x, sprite.y);
    this.active = true;
    this.parent = null;
    this.traits = [];
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

  // aliases for RBush
  get minX() {
    return this.position.x;
  }

  get minY() {
    return this.position.y;
  }

  get maxX() {
    return this.position.x + baseSize;
  }

  get maxY() {
    return this.position.y + baseSize;
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  update(deltaTime) {
    if (this.active) {
      let index = this.traits.length;

      while (index > 0) {
        this.traits[--index].update(this, deltaTime);
      }
    }
  }

  postUpdate() {
    if (!this.active) {
      this._destroy();
    }
  }

  destroy() {
    this.active = false;
  }

  _destroy() {
    if (this.parent) {
      this.parent.remove(this);
      this.parent = null;
    }
    this.sprite.destroy();
    this.sprite = null;
  }
}

export default Body;
