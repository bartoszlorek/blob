import {arrayForEach} from '@utils/array';
import Container from '@models/Container';
import Bounds from '@models/Bounds';
import Matrix from '@models/Matrix';
import Memo from '@models/Memo';

class EntityContainer extends Container {
  constructor() {
    super();
    this.memo = new Memo();
    this.resolution = 100;
  }

  bounds() {
    return this.memo.use('bounds', () => {
      return new Bounds(this.items);
    });
  }

  closest(other, radius = 1) {
    return this.memo.use('closest', () => {
      const size = radius * 2 + 1;
      const area = new Matrix(size, size);

      this.forEach(entity => {
        const x = entity.gridX - other.gridX + radius;
        const y = entity.gridY - other.gridY + radius;
        if (x >= 0 && x < size && y >= 0 && y < size) {
          area.set(x, y, entity);
        }
      });
      return area;
    });
  }

  // Bin-Lattice Spatial Subdivision
  // method implementation

  forEachIn(entity, callback) {
    const name = this.subdividedName(entity);
    const items = this.memo.use('forEachIn', () => {
      return this.subdivideItems();
    });

    if (items[name]) {
      arrayForEach(items[name], callback);
    }
  }

  subdivideItems() {
    const result = {};
    this.forEach(entity => {
      const name = this.subdividedName(entity);
      result[name] === undefined && (result[name] = []);
      result[name].push(entity);
    });
    return result;
  }

  subdividedName(entity) {
    const global = entity.ownerGlobal;
    const x = Math.round(global.localToGlobalX(entity.pos.x) / this.resolution);
    const y = Math.round(global.localToGlobalY(entity.pos.y) / this.resolution);
    return `${x}-${y}`;
  }
}

export default EntityContainer;
