import BoundingBox from '@models/BoundingBox';
import * as Vector from '@models/Vector';

console.log();

class Body {
  constructor(sprite, x = 0, y = 0, size = 24) {
    this.bbox = new BoundingBox([x, y], [x + size, y + size]);
    this.velocity = Vector.create(0, 0);
    this.size = size;

    // pixijs
    this.sprite = sprite;

    // parameters
    this.traits = [];
    this.isAlive = true;
    this.isBody = true;
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  update(deltaTime) {
    // update sprite to the position from the previous frame
    this.sprite.position.x = this.bbox.min[0];
    this.sprite.position.y = this.bbox.min[1];

    // traits phase
    for (let index = 0; index < this.traits.length; index++) {
      this.traits[index].update(this, deltaTime);
    }

    // apply velocity from the current frame to the bbox
    this.bbox.translateX(this.velocity[0] * deltaTime);
    this.bbox.translateY(this.velocity[1] * deltaTime);
  }

  destroy() {
    this.isAlive = false;
  }

  unsafeDestroy() {
    this.sprite.destroy();
    this.sprite = null;
    this.bbox = null;
  }
}

export default Body;
