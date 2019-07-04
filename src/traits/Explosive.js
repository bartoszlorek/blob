import {Sprite} from 'pixi.js';
import {arrayReduce} from '@utils/array';
import {objectForEach} from '@utils/object';
import Entity from '@models/Entity';
// import Matrix from '@models/Matrix';
import Trait from '@traits/Trait';
import Blink from '@traits/Blink';
import Animation from '@traits/Animation';

class Explosive extends Trait {
  constructor({global, range = 0}) {
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
      entity.addTrait(new Blink({freq: 0.1}));
    }
    // boom
    if (this.delay < 0) {
      const {layers, physics, player: playerEntity} = this.global.level;
      const {effects, ground, player} = layers;

      effects.append(this.createBlastFrom(entity));

      // destroy others entities
      const others = this.inRange(entity, [ground, player]);
      objectForEach(others.entries, entity => entity.destroy());

      // destroy mine itself
      entity.destroy();

      // may we finish the game?
      if (playerEntity) {
        physics.updateBounds();
      } else {
        console.log('dead!');
      }
    }

    this.delay -= deltaTime;
    this.ignite();
  }

  createBlastFrom(entity) {
    const {texture} = this.global.assets['blast'];
    const blast = new Entity(
      new Sprite(texture),
      entity.sprite.x,
      entity.sprite.y
    );
    let scale = 1;

    blast.addTrait(new Animation());
    blast.animation.play('explode', [
      [10, () => (blast.scale = scale += this.range)],
      [100, () => (blast.scale = scale += this.range)],
      [200, () => (blast.scale = scale -= this.range / 2)],
      [250, () => blast.destroy()]
    ]);
    return blast;
  }

  inRange(entity, layers) {
    const size = this.range * 2 + 1;
    const fn = (mat, layer) =>
      mat.merge(layer.entities.closest(entity, this.range));
    return arrayReduce(layers, fn, new Matrix(size, size));
  }
}

export default Explosive;
