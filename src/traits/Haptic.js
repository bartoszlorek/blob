import {arrayForEach} from '@utils/array';
import Vector from '@models/Vector';
import Trait from '@traits/Trait';

class Haptic extends Trait {
  constructor(global, {layers}) {
    super('haptic');
    this.global = global;
    this.layers = layers;

    // parameters
    this.color = 0xcc2d62;
  }

  update(entity, deltaTime) {
    const {layers, physics} = entity.ownerLevel;
    const down = physics.rotateVector(new Vector(0, 1));

    arrayForEach(this.layers, layer => {
      const closest = layers[layer].entities.closest(entity, 1);
      const other = closest.n(down.x + 1, down.y + 1);

      if (other) {
        other.colorful.setColor(this.color);
      }
    });
  }
}

export default Haptic;
