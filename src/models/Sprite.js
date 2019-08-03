import {Sprite as PixiSprite} from 'pixi.js';
import {baseSize, gridToLocal} from '@app/consts';

class Sprite extends PixiSprite {
  constructor(texture, x = 0, y = 0) {
    super(texture);

    this.position.x = gridToLocal(x) - baseSize / 2;
    this.position.y = gridToLocal(y) - baseSize / 2;
  }
}

export default Sprite;
