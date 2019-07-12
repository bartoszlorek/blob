import Layer from '@models/Layer';

class ActiveLayer extends Layer {
  constructor(name, filters) {
    super(name, filters, 'active');

    // physics
    this.selfCollision = false;
  }
}

export default ActiveLayer;
