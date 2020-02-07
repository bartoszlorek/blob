// @flow strict

import Vector from '@core/physics/Vector';
import type {VectorType} from '@core/physics/Vector';

class Force {
  vector: VectorType;
  str: number;
  dex: number;

  constructor(
    x: number,
    y: number,
    {str = 1, dex = 0.5}: {str: number, dex: number} = {}
  ) {
    this.vector = Vector.create(x, y);
    this.str = str;
    this.dex = dex;
  }

  applyDirection(vector: VectorType) {
    Vector.lerp(this.vector, vector, this.dex);
  }

  applyTo(vector: VectorType) {
    vector[0] += this.vector[0] * this.str;
    vector[1] += this.vector[1] * this.str;
    return vector;
  }
}

export default Force;
