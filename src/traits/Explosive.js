import {Sprite} from 'pixi.js';
import {arrayForEach} from '@utils/array';
import {objectForEach} from '@utils/object';
import {matrix3Merge} from '@utils/matrix';

import Entity from '@models/Entity';
import Trait from '@traits/Trait';
import Blink from '@traits/Blink';
import Animation from '@traits/Animation';

const identity = a => a;
const destroy = child => {
  child.parent.removeChild(child);
};

class Explosive extends Trait {
  constructor({global, range}) {
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
      const {effects, ground, player} = this.global.level.layers;
      effects.addChild(this.createBlastFrom(entity));

      // destroy others entities
      const others = this.getInRange(entity, [ground, player]);
      objectForEach(others, destroy);

      // destroy mine itself
      destroy(entity);

      // may we finish the game?
      if (!player.children.length) {
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
      [250, () => destroy(blast)]
    ]);
    return blast;
  }

  getInRange(entity, layers) {
    const out = [];
    let index = layers.length;

    while (index > 0) {
      const closest = layers[--index].closest(entity.gridX, entity.gridY);

      if (closest) {
        matrix3Merge(out, closest);
      }
    }
    return out.filter(identity);
  }
}

export default Explosive;
