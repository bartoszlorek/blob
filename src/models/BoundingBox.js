class BoundingBox {
  constructor(min = [0, 0], dimension = [0, 0]) {
    this.min = min;
    this.dimension = dimension;

    // prettier-ignore
    this.max = [
      min[0] + dimension[0],
      min[1] + dimension[1],
    ];
  }

  translate(vector) {
    this.min[0] += vector[0];
    this.min[1] += vector[1];
    this.max[0] += vector[0];
    this.max[1] += vector[1];
  }

  translateX(value) {
    this.min[0] += value;
    this.max[0] += value;
  }

  translateY(value) {
    this.min[1] += value;
    this.max[1] += value;
  }

  intersects(bbox) {
    return !(
      this.min[0] > bbox.max[0] ||
      this.min[1] > bbox.max[1] ||
      this.max[0] < bbox.min[0] ||
      this.max[1] < bbox.min[1]
    );
  }

  contains(x, y) {
    return !(
      this.min[0] > x ||
      this.max[0] < x ||
      this.min[1] > y ||
      this.max[1] < y
    );
  }

  copy(bbox) {
    this.min[0] = bbox.min[0];
    this.min[1] = bbox.min[1];
    this.max[0] = bbox.max[0];
    this.max[1] = bbox.max[1];
    this.dimension[0] = bbox.dimension[0];
    this.dimension[1] = bbox.dimension[1];
  }
}

export default BoundingBox;