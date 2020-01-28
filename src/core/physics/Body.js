import BoundingBox from '@core/BoundingBox';
import Vector from '@core/physics/Vector';

class Body extends BoundingBox {
  constructor(sprite, x = 0, y = 0, size = 32) {
    super([x, y], [x + size, y + size]);

    // pixijs
    this.sprite = sprite;
    this.sprite.anchor.set(0.5);

    // props
    this.size = size;
    this.velocity = Vector.create(0, 0);
    this.actions = [];
    this.action = {};
    this.parent = null;

    // flags
    this.isBody = true;
    this.isAlive = true;

    // process
    this.updateSprite();
  }

  update(deltaTime) {
    // update sprite to the position from the previous frame
    this.updateSprite();

    // actions phase
    for (let index = 0; index < this.actions.length; index++) {
      this.actions[index].update(this, deltaTime);
    }

    // apply velocity from the current frame to the bbox
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);
  }

  updateSprite() {
    this.sprite.position.x = this.min[0] + this.size / 2;
    this.sprite.position.y = this.min[1] + this.size / 2;
  }

  addAction(action) {
    this.actions.push(action);
    this.action[action.name] = action;
  }

  destroy() {
    this.parent.removeChild(this);
  }

  unsafeDestroy() {
    this.sprite.destroy();
    this.sprite = null;
    this.parent = null;
  }
}

export default Body;
