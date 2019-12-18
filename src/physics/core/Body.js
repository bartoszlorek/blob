import BoundingBox from '@models/BoundingBox';
import Vector from '@models/Vector';

class Body extends BoundingBox {
  constructor(sprite, x = 0, y = 0, size = 24) {
    super([x, y], [x + size, y + size]);

    this.velocity = Vector.create(0, 0);
    this.size = size;

    // pixijs
    this.sprite = sprite;
    this.sprite.anchor.set(0.5);

    // parameters
    this.traits = [];
    this.isAlive = true;
    this.isBody = true;
  }

  update(deltaTime) {
    // update sprite to the position from the previous frame
    this.sprite.position.x = this.min[0] + this.size / 2;
    this.sprite.position.y = this.min[1] + this.size / 2;

    // traits phase
    for (let index = 0; index < this.traits.length; index++) {
      this.traits[index].update(this, deltaTime);
    }

    // apply velocity from the current frame to the bbox
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
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
