import {Sprite} from 'pixi.js';
import {arrayForEach} from '@utils/array';
import {matrix3Merge} from '@utils/matrix';

import Entity from '@models/Entity';
import Trait from '@traits/Trait';
import Animation from '@traits/Animation';

const identity = a => a;
const destroy = child => child.remove();

class Explosive extends Trait {
  constructor({global, scene, range}) {
    super('explosive');
    this.global = global;
    this.scene = scene;

    this.range = range;
    this.ignition = 0;

    // parameters
    this.delay = 0.25;
  }

  collide() {
    this.ignition += 1;
  }

  update(entity, deltaTime) {
    if (this.ignition === 0) {
      return;
    }

    // bang
    if (this.ignition === 1) {
      entity.animation.blink.play();
    }

    // boom
    if (this.delay < 0) {
      const {effects, ground, player} = this.scene.layers;
      effects.addChild(this.createBlastFrom(entity));

      // destroy everything in range
      const others = this.getInRange(entity, [ground, player]);
      arrayForEach(others, destroy);

      // destroy mine itself
      destroy(entity);

      if (!player.children.length) {
        this.global.events.publish('player_dead');
      }
    }

    this.delay -= deltaTime;
    this.ignition += 1;
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
    blast.animation.add('explode', [
      [10, () => (blast.scale = scale += this.range)],
      [100, () => (blast.scale = scale += this.range)],
      [200, () => (blast.scale = scale -= this.range / 2)],
      [250, () => blast.remove()]
    ]);
    blast.animation.explode.play();
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
