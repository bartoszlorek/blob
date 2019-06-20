import {lerp} from '@utils/math';
import Vector from '@models/Vector';

class Force extends Vector {
  constructor(x, y, {strength = 1, bias = 0.5} = {}) {
    super(x, y);
    this.strength = strength;
    this.bias = bias;
  }

  setForce(x, y) {
    this.x = lerp(this.x, x, this.bias);
    this.y = lerp(this.y, y, this.bias);
    return this;
  }

  applyTo(vector) {
    vector.x += this.x * this.strength;
    vector.y += this.y * this.strength;
    return this;
  }
}

export default Force;
