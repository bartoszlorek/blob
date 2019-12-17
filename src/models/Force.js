import Vector from '@models/Vector';

class Force {
  constructor(x, y, {str = 1, dex = 0.5} = {}) {
    this.vector = Vector.create(x, y);
    this.str = str;
    this.dex = dex;
  }

  update(vector) {
    Vector.lerp(this.vector, vector, this.dex);
  }

  applyTo(vector) {
    vector[0] += this.vector[0] * this.str;
    vector[1] += this.vector[1] * this.str;
    return vector;
  }
}

export default Force;
