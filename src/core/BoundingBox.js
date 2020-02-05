// @flow strict

import type {VectorType} from '@core/physics/Vector';

class BoundingBox {
  min: VectorType;
  max: VectorType;
  width: number;
  height: number;

  constructor(min: VectorType = [0, 0], max: VectorType = [0, 0]) {
    this.min = min;
    this.max = max;
    this.width = max[0] - min[0];
    this.height = max[1] - min[1];
  }

  translate(vector: VectorType) {
    this.min[0] += vector[0];
    this.min[1] += vector[1];
    this.max[0] += vector[0];
    this.max[1] += vector[1];
  }

  translateX(value: number) {
    this.min[0] += value;
    this.max[0] += value;
  }

  translateY(value: number) {
    this.min[1] += value;
    this.max[1] += value;
  }

  align(vector: VectorType) {
    this.min[0] = vector[0];
    this.max[0] = vector[0] + this.width;
    this.min[1] = vector[1];
    this.max[1] = vector[1] + this.height;
  }

  alignX(value: number) {
    this.min[0] = value;
    this.max[0] = value + this.width;
  }

  alignY(value: number) {
    this.min[1] = value;
    this.max[1] = value + this.height;
  }

  intersects(bbox: BoundingBox) {
    return !(
      this.min[0] > bbox.max[0] ||
      this.min[1] > bbox.max[1] ||
      this.max[0] < bbox.min[0] ||
      this.max[1] < bbox.min[1]
    );
  }

  intersectsMargin(bbox: BoundingBox, margin: number) {
    return !(
      this.min[0] > bbox.max[0] + margin ||
      this.min[1] > bbox.max[1] + margin ||
      this.max[0] < bbox.min[0] - margin ||
      this.max[1] < bbox.min[1] - margin
    );
  }

  contains(x: number, y: number) {
    return !(
      this.min[0] > x ||
      this.max[0] < x ||
      this.min[1] > y ||
      this.max[1] < y
    );
  }

  copy(bbox: BoundingBox) {
    this.min[0] = bbox.min[0];
    this.min[1] = bbox.min[1];
    this.max[0] = bbox.max[0];
    this.max[1] = bbox.max[1];
  }
}

export default BoundingBox;
