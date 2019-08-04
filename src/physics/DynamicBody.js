import Vector from '@models/Vector';
import Body from '@physics/Body';

class DynamicBody extends Body {
  constructor(sprite) {
    super(sprite, 'dynamic');

    // simulation
    this.velocity = new Vector(0, 0);
    this.gravity = null;
  }

  postUpdate(deltaTime) {
    // todo: update position here
    // this.position.x += this.velocity.x * deltaTime;
    // this.position.y += this.velocity.y * deltaTime;
    this.updateSprite();
  }
}

export default DynamicBody;
