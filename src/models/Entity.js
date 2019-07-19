import {baseSize, localToGrid} from '@app/consts';
import Vector from '@models/Vector';

class Entity {
  constructor(sprite, localX = 0, localY = 0) {
    if (!sprite) {
      throw 'sprite parameter is required to create an Entity';
    }
    this.velocity = new Vector(0, 0);
    this.parent = null;
    this.traits = [];

    // graphics
    this.sprite = sprite;
    this.sprite.position.set(localX, localY);
    this.sprite.anchor.set(0.5);

    this.processing = false;
  }

  set scale(value) {
    this.sprite.scale.set(value, value);
  }

  get scale() {
    return this.sprite.scale.x;
  }

  set visible(value) {
    this.sprite.visible = value;
  }

  get visible() {
    return this.sprite.visible;
  }

  set top(value) {
    this.sprite.position.y = value + baseSize / 2;
  }

  set right(value) {
    this.sprite.position.x = value - baseSize / 2;
  }

  set bottom(value) {
    this.sprite.position.y = value - baseSize / 2;
  }

  set left(value) {
    this.sprite.position.x = value + baseSize / 2;
  }

  get top() {
    return this.sprite.position.y - baseSize / 2;
  }

  get right() {
    return this.sprite.position.x + baseSize / 2;
  }

  get bottom() {
    return this.sprite.position.y + baseSize / 2;
  }

  get left() {
    return this.sprite.position.x - baseSize / 2;
  }

  get gridX() {
    return localToGrid(this.sprite.position.x);
  }

  get gridY() {
    return localToGrid(this.sprite.position.y);
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  update(deltaTime) {
    for (let i = 0, j = this.traits.length; i < j; ++i) {
      this.traits[i].update(this, deltaTime);
    }
  }

  intersection(other) {
    return (
      this.top < other.bottom &&
      this.bottom > other.top &&
      this.right > other.left &&
      this.left < other.right
    );
  }

  distance(other) {
    return Math.abs(this.gridX - other.gridX + this.gridY - other.gridY);
  }

  remove() {
    this.parent.removeChild(this);
  }
}

export default Entity;
