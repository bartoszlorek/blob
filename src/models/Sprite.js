import {Sprite as PixiSprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';

class Sprite extends PixiSprite {
  constructor(texture, x = 0, y = 0) {
    super(texture);

    this.position.x = gridToLocal(x);
    this.position.y = gridToLocal(y);
  }
}

export default Sprite;
