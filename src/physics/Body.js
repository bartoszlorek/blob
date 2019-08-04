import {baseSize, localToGrid} from '@app/consts';
import Vector from '@models/Vector';

class Body {
  constructor(sprite, type = 'static') {
    this.type = type;

    // pixijs di
    const {x, y} = sprite;
    this.sprite = sprite;

    sprite.anchor.set(0.5);
    sprite.x = x + baseSize / 2;
    sprite.y = y + baseSize / 2;

    // parameters
    this.traits = [];
    this.parent = null;

    // simulation
    this.position = new Vector(x, y);

    // flags
    this.isBody = true;
    this.isAlive = true;
  }

  set minX(value) {
    this.position.x = value;
  }

  set minY(value) {
    this.position.y = value;
  }

  set maxX(value) {
    this.position.x = value - baseSize;
  }

  set maxY(value) {
    this.position.y = value - baseSize;
  }

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

  get gridX() {
    return localToGrid(this.position.x);
  }

  get gridY() {
    return localToGrid(this.position.y);
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  update(deltaTime) {
    let index = this.traits.length;

    while (index > 0) {
      this.traits[--index].update(this, deltaTime);
    }
  }

  updateSprite() {
    this.sprite.x = this.position.x + baseSize / 2;
    this.sprite.y = this.position.y + baseSize / 2;
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
    if (this.parent) {
      this.parent.remove(this);
      this.parent = null;
    }
    this.sprite.destroy();
    this.sprite = null;
  }
}

export default Body;
