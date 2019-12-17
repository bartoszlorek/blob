import Vector from '@models/Vector';

export const RAY_TYPE = {
  SOLID: 0,
  BORDER: 1,
};

class Ray {
  constructor(x, y) {
    this.type = RAY_TYPE.SOLID;
    this.vector = Vector.create(x, y);
    this.length = 0;
  }

  cast(tilemap, x, y) {
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

  lengthToBorder(tilemap, x, y) {
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

  static min(a, b) {
    if (!a || !b) {
      return a || b || null;
    }
    if (a.length < b.length) {
      return a;
    }
    if (b.length < a.length) {
      return b;
    }
  }
}

export default Ray;
