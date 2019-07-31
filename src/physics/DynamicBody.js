import Vector from '@models/Vector';
import Body from './Body';

class DynamicBody extends Body {
  constructor(sprite) {
    super(sprite, 'dynamic');
    this.velocity = new Vector(0, 0);
  }

  update(deltaTime) {
    if (this.active) {
      this.position.x += this.velocity.x * deltaTime;
      this.position.y += this.velocity.y * deltaTime;
      super.update(deltaTime);
    }
  }

  postUpdate() {
    if (this.active) {
      this.sprite.x = this.position.x;
      this.sprite.y = this.position.y;
    } else {
      super.postUpdate();
    }
  }
}

export default DynamicBody;
