import {baseSize, localToGrid} from '@app/consts';
import Vector from '@models/Vector';

class Body {
  constructor(sprite) {
    this.sprite = sprite;

    // parameters
    this.traits = [];
    this.isAlive = true;
    this.isBody = true;

    // physics
    this.velocity = new Vector(0, 0);
    this.gravity = null;
  }

  set minX(value) {
    this.sprite.position.x = value;
  }

  set minY(value) {
    this.sprite.position.y = value;
  }

  set maxX(value) {
    this.sprite.position.x = value - baseSize;
  }

  set maxY(value) {
    this.sprite.position.y = value - baseSize;
  }

  get minX() {
    return this.sprite.position.x;
  }

  get minY() {
    return this.sprite.position.y;
  }

  get maxX() {
    return this.sprite.position.x + baseSize;
  }

  get maxY() {
    return this.sprite.position.y + baseSize;
  }

  get tileX() {
    return localToGrid(this.sprite.position.x);
  }

  get tileY() {
    return localToGrid(this.sprite.position.y);
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  update(deltaTime) {
    for (let index = 0; index < this.traits.length; index++) {
      this.traits[index].update(this, deltaTime);
    }

    this.sprite.position.x += this.velocity.x * deltaTime;
    this.sprite.position.y += this.velocity.y * deltaTime;
  }

  intersection(other) {
    return !(
      other.minX >= this.maxX ||
      other.maxX <= this.minX ||
      other.minY >= this.maxY ||
      other.maxY <= this.minY
    );
  }

  destroy() {
    this.isAlive = false;
  }

  unsafeDestroy() {
    this.sprite.destroy();
    this.sprite = null;
  }
}

export default Body;
