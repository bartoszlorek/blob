import {baseSize} from '@app/consts';
import Vector from '@models/Vector';
import Body from './Body';

class DynamicBody extends Body {
  constructor(sprite) {
    super(sprite, 'dynamic');

    // simulation
    this.velocity = new Vector(0, 0);
    this.gravity = null;
  }

  postUpdate(deltaTime) {
    // this.position.x += this.velocity.x * deltaTime;
    // this.position.y += this.velocity.y * deltaTime;
    this.sprite.x = this.position.x + baseSize / 2;
    this.sprite.y = this.position.y + baseSize / 2;
  }
}

export default DynamicBody;
