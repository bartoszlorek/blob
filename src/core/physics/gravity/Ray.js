// @flow strict

import Vector from '@core/physics/Vector';
import Tilemap from '@core/structure/Tilemap';
import type {VectorType} from '@core/physics/Vector';

type RayType = 0 | 1;

export const RAY_TYPE: {[name: string]: RayType} = {
  SOLID: 0,
  BORDER: 1,
};

class Ray {
  type: RayType;
  vector: VectorType;
  length: number;

  constructor(x: number, y: number) {
    this.type = RAY_TYPE.SOLID;
    this.vector = Vector.create(x, y);
    this.length = 0;
  }

  cast(tilemap: Tilemap, x: number, y: number) {
    const length = tilemap.raycast(x, y, this.vector[0], this.vector[1]);

    if (length >= 0) {
      this.type = RAY_TYPE.SOLID;
      this.length = length;
    } else {
      this.type = RAY_TYPE.BORDER;
      this.length = this.lengthToBorder(tilemap, x, y);
    }
    return this;
  }

  lengthToBorder(tilemap: Tilemap, x: number, y: number) {
    if (this.vector[1] === -1) {
      return Math.abs(tilemap.min[1] - y) + 1;
    }
    if (this.vector[0] === 1) {
      return Math.abs(tilemap.max[0] - x) + 1;
    }
    if (this.vector[1] === 1) {
      return Math.abs(tilemap.max[1] - y) + 1;
    }
    if (this.vector[0] === -1) {
      return Math.abs(tilemap.min[0] - x) + 1;
    }
    return 0;
  }

  static min(a: ?Ray, b: ?Ray) {
    if (!a || !b) {
      return a || b || null;
    }
    if (a.length < b.length) {
      return a;
    }
    if (b.length < a.length) {
      return b;
    }
    return null;
  }
}

export default Ray;
