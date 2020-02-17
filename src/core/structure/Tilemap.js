// @flow strict

import BoundingBox from '@core/BoundingBox';
import Vector from '@core/physics/Vector';

import type {VectorType} from '@core/physics/Vector';

class Tilemap extends BoundingBox {
  values: Array<number>;
  dimension: number;
  tilesize: number;
  offset: VectorType;

  _closestArray: Array<number>;
  _point: VectorType;

  constructor(
    values: Array<number> = [],
    dimension: number = 8,
    tilesize: number = 32,
    offset: VectorType = [0, 0]
  ) {
    super();

    this.values = [...values];
    this.dimension = dimension;
    this.tilesize = tilesize;
    this.offset = offset;

    this._closestArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this._point = Vector.create();

    // initial calculation
    this.calculateBoundingBox();
  }

  removeByIndex(index: number) {
    this.values[index] = 0;
    this.calculateBoundingBox();
  }

  getIndex(x: number, y: number) {
    return x + this.dimension * y;
  }

  getPoint(index: number) {
    this._point[0] = (index % this.dimension) + this.offset[0];
    this._point[1] = Math.floor(index / this.dimension) + this.offset[1];
    return this._point;
  }

  search(
    bbox: BoundingBox,
    iteratee: (value: number, index: number, tilemap: Tilemap) => mixed
  ) {
    const startX = Math.floor(bbox.min[0] / this.tilesize) - this.offset[0];
    const startY = Math.floor(bbox.min[1] / this.tilesize) - this.offset[1];
    const endX = Math.floor(bbox.max[0] / this.tilesize) - this.offset[0];
    const endY = Math.floor(bbox.max[1] / this.tilesize) - this.offset[1];

    const minX = this.min[0] / this.tilesize - this.offset[0];
    const maxX = this.max[0] / this.tilesize - this.offset[0];
    const minY = this.min[1] / this.tilesize - this.offset[1];
    const maxY = this.max[1] / this.tilesize - this.offset[1];

    for (let y = startY; y < endY; y += 1) {
      if (y < minY || y >= maxY) continue;

      for (let x = startX; x < endX; x += 1) {
        if (x < minX || x >= maxX) continue;

        const index = this.getIndex(x, y);
        const value = this.values[index];

        if (value > 0) {
          const result = iteratee(value, index, this);

          if (result !== undefined) {
            return result;
          }
        }
      }
    }
  }

  closest(x: number, y: number) {
    const ox = x - this.offset[0];
    const oy = y - this.offset[1];
    const arr = this._closestArray;

    const start0 = this.getIndex(ox - 1, oy - 1);
    const start1 = this.getIndex(ox - 1, oy);
    const start2 = this.getIndex(ox - 1, oy + 1);

    const row0 = oy - 1 >= 0;
    const row1 = oy >= 0;
    const row2 = oy + 1 >= 0;

    const col0 = !(ox - 1 < 0 || ox - 1 >= this.dimension);
    const col1 = !(ox < 0 || ox >= this.dimension);
    const col2 = !(ox + 1 < 0 || ox + 1 >= this.dimension);

    arr[0] = row0 && col0 ? this.values[start0] || 0 : 0;
    arr[1] = row0 && col1 ? this.values[start0 + 1] || 0 : 0;
    arr[2] = row0 && col2 ? this.values[start0 + 2] || 0 : 0;

    arr[3] = row1 && col0 ? this.values[start1] || 0 : 0;
    arr[4] = row1 && col1 ? this.values[start1 + 1] || 0 : 0;
    arr[5] = row1 && col2 ? this.values[start1 + 2] || 0 : 0;

    arr[6] = row2 && col0 ? this.values[start2] || 0 : 0;
    arr[7] = row2 && col1 ? this.values[start2 + 1] || 0 : 0;
    arr[8] = row2 && col2 ? this.values[start2 + 2] || 0 : 0;

    return arr;
  }

  // we should assume that x and y are inside tilemap bounding box
  raycastInside(x: number, y: number, dx: number, dy: number) {
    const startX = x - this.offset[0];
    const startY = y - this.offset[1];

    let limitSteps = 0;
    let length = 0;

    let currentIndex = this.getIndex(startX, startY);
    const indexShift = this.getIndex(startX + dx, startY + dy) - currentIndex;

    if (dx !== 0) {
      if (dx > 0) {
        limitSteps = this.max[0] / this.tilesize - startX - 1;
      } else {
        limitSteps = startX - this.min[0] / this.tilesize;
      }
    } else {
      if (dy > 0) {
        limitSteps = this.max[1] / this.tilesize - startY - 1;
      } else {
        limitSteps = startY - this.min[1] / this.tilesize;
      }
    }

    while (0 <= limitSteps--) {
      if (this.values[currentIndex] > 0) {
        return length;
      }
      currentIndex += indexShift;
      length += 1;
    }
    return -1;
  }

  raycast(x: number, y: number, dx: number, dy: number) {
    // todo: optimize raycast
    const minX = this.min[0] / this.tilesize;
    const maxX = this.max[0] / this.tilesize;
    const minY = this.min[1] / this.tilesize;
    const maxY = this.max[1] / this.tilesize;

    const horizontal = dx !== 0;

    // ignore ray that for sure will miss the map
    if (horizontal ? minY > y || maxY < y : minX > x || maxX < x) {
      return -1;
    }

    const fromMin = horizontal ? x - minX : y - minY;
    const fromMax = horizontal ? maxX - x : maxY - y;
    const toMin = dx < 0 || dy < 0;
    const toMax = dx > 0 || dy > 0;

    // ignore ray in the opposite direction
    if ((toMin && fromMin <= 0) || (toMax && fromMax <= 0)) {
      return -1;
    }

    let shiftX = 0;
    let shiftY = 0;
    let length = 0;

    // shift ray origin point closer to the map before casting ray
    if ((toMin && fromMax < 0) || (toMax && fromMin < 0)) {
      shiftX = dx > 0 ? minX - x : dx < 0 ? maxX - x : 0;
      shiftY = dy > 0 ? minY - y : dy < 0 ? maxY - y : 0;
      length = Math.abs(shiftX + shiftY);
    }

    const startX = x + shiftX - this.offset[0];
    const startY = y + shiftY - this.offset[1];
    let currentIndex = this.getIndex(startX, startY);
    const indexShift = this.getIndex(startX + dx, startY + dy) - currentIndex;

    // the amount of steps should not be greater than distance
    // between point to the edge on map in current direction
    let limitSteps = fromMin + fromMax;

    while (0 <= limitSteps--) {
      if (this.values[currentIndex] > 0) {
        return length;
      }
      currentIndex += indexShift;
      length += 1;
    }
    return -1;
  }

  calculateBoundingBox() {
    if (this.values.length === 0) {
      this.min[0] = 0;
      this.min[1] = 0;
      this.max[0] = 0;
      this.max[1] = 0;
      return;
    }

    let x = 0;
    let y = 0;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let index = 0; index < this.values.length; index++) {
      if (x === this.dimension) {
        x = 0;
        y += 1;
      }

      if (this.values[index] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }

      x += 1;
    }

    this.min[0] = (minX + this.offset[0]) * this.tilesize;
    this.min[1] = (minY + this.offset[1]) * this.tilesize;
    this.max[0] = (maxX + this.offset[0] + 1) * this.tilesize;
    this.max[1] = (maxY + this.offset[1] + 1) * this.tilesize;
  }
}

export default Tilemap;
