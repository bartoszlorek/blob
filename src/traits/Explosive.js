import {Sprite} from 'pixi.js';
import {arrayForEach} from '@utils/array';
import {objectForEach} from '@utils/object';
import Entity from '@models/Entity';
import Trait from '@traits/Trait';
import Blink from '@traits/Blink';
import Animation from '@traits/Animation';

const destroy = child => {
  child.parent.willChange(child, true);
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
      const others = this.inRange(entity, [ground, player]);
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

  inRange(entity, layers) {
    const result = [];

    // todo: better array merging
    arrayForEach(layers, layer => {
      const closest = layer.closest(entity.gridX, entity.gridY);
      const length = closest ? closest.length : 0;

      for (let i = 0; i < length; i++) {
        if (closest[i]) result.push(closest[i]);
      }
    });
    return result;
  }
}

export default Explosive;
