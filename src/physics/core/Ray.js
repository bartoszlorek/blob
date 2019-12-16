export const RAY_TYPE = {
  SOLID: 0,
  BORDER: 1,
};

class Ray {
  constructor(x, y) {
    this.type = RAY_TYPE.SOLID;
    this.vector = Object.freeze({x, y});
    this.length = 0;
  }

  cast(tilemap, x, y) {
    const length = tilemap.raycast(x, y, this.vector.x, this.vector.y);

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
    if (this.vector.y === -1) {
      return Math.abs(tilemap.bounds.minY - y) + 1;
    }
    if (this.vector.x === 1) {
      return Math.abs(tilemap.bounds.maxX - x) + 1;
    }
    if (this.vector.y === 1) {
      return Math.abs(tilemap.bounds.maxY - y) + 1;
    }
    if (this.vector.x === -1) {
      return Math.abs(tilemap.bounds.minX - x) + 1;
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
