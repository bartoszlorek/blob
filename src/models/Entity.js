import {arrayForEach} from '@utils/array';
import Vector from '@models/Vector';

class Entity {
  constructor(x = 0, y = 0, size = 1) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.parent = null;
    this.traits = [];

    this.visible = true;
    this.color = null;
    this.size = size;
  }

  get top() {
    return this.pos.y - this.size / 2;
  }

  set top(y) {
    this.pos.y = y + this.size / 2;
  }

  get bottom() {
    return this.pos.y + this.size / 2;
  }

  set bottom(y) {
    this.pos.y = y - this.size / 2;
  }

  get left() {
    return this.pos.x - this.size / 2;
  }

  set left(x) {
    this.pos.x = x + this.size / 2;
  }

  get right() {
    return this.pos.x + this.size / 2;
  }

  set right(x) {
    this.pos.x = x - this.size / 2;
  }

  get gridX() {
    return this.ownerGlobal.localToGrid(this.pos.x);
  }

  get gridY() {
    return this.ownerGlobal.localToGrid(this.pos.y);
  }

  get ownerLevel() {
    return (this.parent && this.parent.level) || null;
  }

  get ownerGlobal() {
    return (this.ownerLevel && this.ownerLevel.global) || null;
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

  obstruct(edge, other) {
    arrayForEach(this.traits, trait => {
      trait.obstruct(this, edge, other);
    });
  }

  intersection(other) {
    return (
      this.top < other.bottom &&
      this.bottom > other.top &&
      this.right > other.left &&
      this.left < other.right
    );
  }
}

export default Entity;
