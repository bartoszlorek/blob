import {Sprite as PixiSprite} from 'pixi.js';
import {baseSize} from '@app/consts';

class Sprite extends PixiSprite {
  constructor(texture, x = 0, y = 0) {
    super(texture);

    this.position.x = x * baseSize;
    this.position.y = y * baseSize;

    this.isSprite = true;
    this.animator = null;
    this.scene = null;
  }

  destroy() {
    if (this.animator) {
      this.scene.animations.remove(this);
    }
    this.scene = null;
    super.destroy();
  }
}

export default Sprite;
