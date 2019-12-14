export function create(x = 0, y = 0) {
  return [x, y];
}

export function copy(out, vector) {
  out[0] = vector[0];
  out[1] = vector[1];
  return out;
}

export function multiply(out, vector) {
  out[0] *= vector[0];
  out[1] *= vector[1];
  return out;
}

export function multiplyX(out, value) {
  out[0] *= value;
  return out;
}

export function multiplyY(out, value) {
  out[1] *= value;
  return out;
}

export function isVertical(vector) {
  return Math.abs(vector[0]) < Math.abs(vector[1]);
}

export function isHorizontal(vector) {
  return Math.abs(vector[0]) > Math.abs(vector[1]);
}

/*
  // direction:
  // [ 0,  1 ] bottom
  // [ 0, -1 ] top
  // [ 1,  0 ] right
  // [-1,  0 ] left

  get direction() {
    return new Vector(Math.round(this.x), Math.round(this.y));
  }
}
*/
