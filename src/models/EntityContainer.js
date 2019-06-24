import Container from '@models/Container';
import Bounds from '@models/Bounds';
import Matrix from '@models/Matrix';
import Memo from '@models/Memo';

class EntityContainer extends Container {
  constructor() {
    super();
    // todo: Bin-Lattice Spatial Subdivision
    this.memo = new Memo();
  }

  bounds() {
    return this.memo.use('bounds', () => {
      return this._bounds();
    });
  }

  closest(entity, radius = 1) {
    return this.memo.use('closest', () => {
      return this._closest(entity, radius);
    });
  }

  _bounds() {
    return new Bounds(this.items);
  }

  _closest(entity, radius = 1) {
    const size = radius * 2 + 1;
    const area = new Matrix(size, size);

    this.forEach(other => {
      const x = other.gridX - entity.gridX + radius;
      const y = other.gridY - entity.gridY + radius;
      if (x >= 0 && x < size && y >= 0 && y < size) {
        area.set(x, y, other);
      }
    });
    return area;
  }
}

export default EntityContainer;
