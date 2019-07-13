import {matrix3Fill} from '@utils/matrix';
import Layer from '@models/Layer';

class ActiveLayer extends Layer {
  constructor(name, filters) {
    super(name, filters, 'active');

    // physics
    this.selfCollision = false;

    // object pools
    this._closestArray = [];
  }

  closest(x, y) {
    let index = this.children.length;
    matrix3Fill(this._closestArray);

    while (index > 0) {
      const child = this.children[--index];

      const a = child.gridX - x + 1;
      const b = child.gridY - y + 1;

      if (!(a < 0 || a > 2 || b < 0 || b > 2)) {
        this._closestArray[b * 3 + a] = child;
      }
    }
    return this._closestArray;
  }
}

export default ActiveLayer;
