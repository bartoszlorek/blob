import Vector from '@models/Vector';
import Body from './Body';

class DynamicBody extends Body {
  constructor(sprite) {
    super(sprite, 'dynamic');

    // simulation
    this.velocity = new Vector(0, 0);
    this.gravity = null;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }

  postUpdate() {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }
}

export default DynamicBody;
