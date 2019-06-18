import Vector from '@utils/Vector';
import {arrayForEach} from '@utils/array';

class Entity {
  constructor(x = 0, y = 0, size = 1) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.size = size;

    this.visible = true;
    this.parent = null;
    this.traits = [];
  }

  get top() {
    return this.pos.y - this.size / 2;
  }

  set top(y) {
    return (this.pos.y = y + this.size / 2);
  }

  get bottom() {
    return this.pos.y + this.size / 2;
  }

  set bottom(y) {
    return (this.pos.y = y - this.size / 2);
  }

  get left() {
    return this.pos.x - this.size / 2;
  }

  set left(x) {
    return (this.pos.x = x + this.size / 2);
  }

  get right() {
    return this.pos.x + this.size / 2;
  }

  set right(x) {
    return (this.pos.x = x - this.size / 2);
  }

  get ownerLevel() {
    return (this.parent && this.parent.level) || null;
  }

  get ownerGlobal() {
    return (this.ownerLevel && this.ownerLevel.global) || null;
  }

  intersection(entity) {
    return (
      this.top < entity.bottom &&
      this.bottom > entity.top &&
      this.right > entity.left &&
      this.left < entity.right
    );
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  update(deltaTime) {
    arrayForEach(this.traits, trait => {
      trait.update(this, deltaTime);
    });
  }

  obstruct(edge, match) {
    arrayForEach(this.traits, trait => {
      trait.obstruct(this, edge, match);
    });
  }
}

export default Entity;
