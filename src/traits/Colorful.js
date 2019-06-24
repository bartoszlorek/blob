import Trait from '@traits/Trait';
import {blend} from '@utils/color';

class Colorful extends Trait {
  constructor() {
    super('colorful');
    this.color = null;
    this.base = null;
    this.bias = 0;

    // parameters
    this.fade = 5;
  }

  setColor(hex) {
    this.color = hex;
    this.bias = 1;
  }

  update(entity, deltaTime) {
    if (this.bias === 0) {
      return;
    }
    if (this.base === null) {
      this.base = entity.color || entity.parent.color;
    }
    entity.color = blend(this.base, this.color, this.bias);
    this.bias -= this.fade * deltaTime;

    if (this.bias < 0) {
      entity.color = null;
      this.base = null;
      this.bias = 0;
    }
  }
}

export default Colorful;
