import {lerp} from '@utils/math';
import Vector from '@utils/Vector';

class Force {
  constructor(vector, factor = 1, bias = 0.5) {
    this.vector = new Vector(vector.x, vector.y);
    this.factor = factor;
    this.bias = bias;
  }

  get vertical() {
    return Math.abs(this.vector.x) < Math.abs(this.vector.y);
  }

  get direction() {
    return {
      x: Math.round(this.vector.x),
      y: Math.round(this.vector.y)
    };
  }

  setForce(x, y) {
    this.vector.x = lerp(this.vector.x, x, this.bias);
    this.vector.y = lerp(this.vector.y, y, this.bias);
  }

  applyTo(vector) {
    vector.x += this.vector.x * this.factor;
    vector.y += this.vector.y * this.factor;
  }

  rotateByForce(x, y) {
    if (this.direction.y < 0) {
      return {x: -x, y: -y};
    }
    if (this.direction.x > 0) {
      return {x: y, y: -x};
    }
    if (this.direction.x < 0) {
      return {x: -y, y: x};
    }
    return {x, y};
  }
}

export default Force;
