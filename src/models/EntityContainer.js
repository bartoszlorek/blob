import Container from '@models/Container';
import Bounds from '@models/Bounds';

class EntityContainer extends Container {
  constructor() {
    super();
    // todo: Bin-Lattice Spatial Subdivision
  }

  bounds() {
    return new Bounds(this.items);
  }
}

export default EntityContainer;
