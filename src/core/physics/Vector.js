// @flow strict

import {lerp} from '@utils/math';

export type VectorType = [number, number];

class Vector {
  static create(x: number = 0, y: number = 0) {
    return [x, y];
  }

  static createImmutable(x: number = 0, y: number = 0) {
    return Object.freeze([x, y]);
  }

  static copy(out: VectorType, vector: VectorType) {
    out[0] = vector[0];
    out[1] = vector[1];
    return out;
  }

  static multiply(out: VectorType, vector: VectorType) {
    out[0] *= vector[0];
    out[1] *= vector[1];
    return out;
  }

  static multiplyX(out: VectorType, value: number) {
    out[0] *= value;
    return out;
  }

  static multiplyY(out: VectorType, value: number) {
    out[1] *= value;
    return out;
  }

  static lerp(out: VectorType, vector: VectorType, amount: number) {
    out[0] = lerp(out[0], vector[0], amount);
    out[1] = lerp(out[1], vector[1], amount);
    return out;
  }

  static isVertical(vector: VectorType) {
    return Math.abs(vector[0]) < Math.abs(vector[1]);
  }

  static isHorizontal(vector: VectorType) {
    return Math.abs(vector[0]) > Math.abs(vector[1]);
  }
}

export default Vector;
