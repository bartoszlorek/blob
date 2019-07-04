import Trait from '@traits/Trait';
import {blend} from '@utils/color';

class Colorful extends Trait {
  constructor() {
    super('colorful');
    this.color = null;
    this.bias = 0;

    // parameters
    this.fade = 5;
  }

  setColor(hex) {
    this.color = hex;
    this.bias = 1;
  }

  update(entity, deltaTime) {
    entity.sprite.tint = 0xffffff;

    if (this.bias === 0) {
      return;
    }
    entity.sprite.tint = blend(0xffffff, this.color, this.bias);
    this.bias -= this.fade * deltaTime;

    if (this.bias < 0) {
      entity.sprite.tint = 0xffffff;
      this.bias = 0;
    }
  }
}

export default Colorful;
