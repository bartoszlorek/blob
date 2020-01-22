import {lerp} from '@utils/math';

class Vector {
  static create(x = 0, y = 0) {
    return [x, y];
  }

  static createImmutable(x = 0, y = 0) {
    return Object.freeze([x, y]);
  }

  static copy(out, vector) {
    out[0] = vector[0];
    out[1] = vector[1];
    return out;
  }

  static multiply(out, vector) {
    out[0] *= vector[0];
    out[1] *= vector[1];
    return out;
  }

  static multiplyX(out, value) {
    out[0] *= value;
    return out;
  }

  static multiplyY(out, value) {
    out[1] *= value;
    return out;
  }

  static lerp(out, vector, amount) {
    out[0] = lerp(out[0], vector[0], amount);
    out[1] = lerp(out[1], vector[1], amount);
    return out;
  }

  static isVertical(vector) {
    return Math.abs(vector[0]) < Math.abs(vector[1]);
  }

  static isHorizontal(vector) {
    return Math.abs(vector[0]) > Math.abs(vector[1]);
  }
}

export default Vector;
