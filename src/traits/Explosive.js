import {arrayReduce} from '@utils/array';
import {objectForEach} from '@utils/object';
import Entity from '@models/Entity';
import Matrix from '@models/Matrix';
import Trait from '@traits/Trait';
import Blink from '@traits/Blink';
import Animation from '@traits/Animation';

class Explosive extends Trait {
  constructor(global, {range = 0}) {
    super('explosive');
    this.global = global;
    this.range = range;
    this.ignition = 0;

    // parameters
    this.delay = 0.25;
  }

  ignite() {
    this.ignition += 1;
  }

  update(entity, deltaTime) {
    if (this.ignition === 0) {
      return;
    }
    // bang
    if (this.ignition === 1) {
      entity.addTrait(new Blink(this.global, {freq: 0.1}));
    }
    // boom
    if (this.delay < 0) {
      const {layers, physics} = this.global.level;
      const {effects, ground, player} = layers;

      effects.append(this.createFlash(entity));

      // destroy others entities
      const others = this.inRange(entity, [ground, player]);
      objectForEach(others.entries, this.destroy);

      // destroy mine itself
      this.destroy(entity);

      // may we finish the game?
      if (player.head) {
        physics.updateBounds();
      } else {
        console.log('dead!');
      }
    }

    this.delay -= deltaTime;
    this.ignite();
  }

  createFlash({pos, size}) {
    const flash = new Entity(pos.x, pos.y, size);
    const blast = size * this.range;

    flash.addTrait(new Animation(this.global, {}));
    flash.animation.play('flash', [
      [10, () => (flash.size += blast)],
      [100, () => (flash.size += blast)],
      [180, () => (flash.size -= blast / 2)],
      [200, () => this.destroy(flash)]
    ]);
    return flash;
  }

  inRange(entity, layers) {
    const size = this.range * 2 + 1;
    const fn = (mat, layer) =>
      mat.merge(layer.entities.closest(entity, this.range));
    return arrayReduce(layers, fn, new Matrix(size, size));
  }

  destroy(entity) {
    entity.parent.remove(entity);
  }
}

export default Explosive;
