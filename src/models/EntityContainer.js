import {createBounds} from '@utils/bounds';
import Container from '@models/Container';

class EntityContainer extends Container {
  constructor() {
    super();
    // todo: Bin-Lattice Spatial Subdivision
  }

  bounds() {
    return createBounds(this.items);
  }
}

export default EntityContainer;
