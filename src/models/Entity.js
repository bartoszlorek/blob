import {arrayForEach} from '@utils/array';
import Vector from '@models/Vector';

class Entity {
  constructor(sprite, x = 0, y = 0) {
    if (!sprite) {
      throw 'sprite parameter is required to create an Entity';
    }
    this.vel = new Vector(0, 0);
    this.sprite = sprite;
    this.parent = null;
    this.traits = [];

    // local position
    this.sprite.position.set(x, y);
    this.sprite.anchor.set(0.5);
  }

  set scale(value) {
    this.sprite.scale.set(value, value);
  }

  set top(y) {
    this.sprite.position.y = y + this.sprite.height / 2;
  }

  set right(x) {
    this.sprite.position.x = x - this.sprite.width / 2;
  }

  set bottom(y) {
    this.sprite.position.y = y - this.sprite.height / 2;
  }

  set left(x) {
    this.sprite.position.x = x + this.sprite.width / 2;
  }

  get top() {
    return this.sprite.position.y - this.sprite.height / 2;
  }

  get right() {
    return this.sprite.position.x + this.sprite.width / 2;
  }

  get bottom() {
    return this.sprite.position.y + this.sprite.height / 2;
  }

  get left() {
    return this.sprite.position.x - this.sprite.width / 2;
  }

  get gridX() {
    return this.ownerGlobal.localToGrid(this.sprite.position.x);
  }

  get gridY() {
    return this.ownerGlobal.localToGrid(this.sprite.position.y);
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
