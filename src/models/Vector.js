class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get vertical() {
    return Math.abs(this.x) < Math.abs(this.y);
  }

  get horizontal() {
    return Math.abs(this.x) > Math.abs(this.y);
  }

  // direction:
  // [ 0,  1 ] bottom
  // [ 0, -1 ] top
  // [ 1,  0 ] right
  // [-1,  0 ] left

  get direction() {
    return new Vector(Math.round(this.x), Math.round(this.y));
  }
}

export default Vector;
