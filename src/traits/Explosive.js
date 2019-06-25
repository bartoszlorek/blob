import {arrayForEach} from '@utils/array';
import Entity from '@models/Entity';
import Trait from '@traits/Trait';
import Blink from '@traits/Blink';
import Animation from '@traits/Animation';

class Explosive extends Trait {
  constructor(global, {range = 0}) {
    super('explosive');
    this.range = range;
    this.timer = 0.25;

    this.ignition = -1;
    this.exploded = false;
  }

  start() {
    this.ignition++;
  }

  update(entity, deltaTime) {
    if (this.ignition < 0 || this.exploded) {
      return false;
    }
    if (this.ignition === 0) {
      entity.addTrait(new Blink({freq: 0.1}));
      this.ignition++;
    } else if (this.timer < 0) {
      this.exploded = true;

      const {level} = entity.parent;
      level.layers.effects.append(this.createFlash(entity));

      const affected = this.affect(entity, [
        level.layers.ground,
        level.layers.player
      ]);
      affected.forEach(this.destroy);
      this.destroy(entity);

      if (level.layers.player.head) {
        level.physics.updateBounds();
      } else {
        console.log('dead!');
      }
    }

    this.timer -= deltaTime;
  }

  createFlash(source) {
    const flash = new Entity(source.pos.x, source.pos.y, source.size);
    flash.addTrait(new Animation());
    flash.animation.play('flash', [
      [0.01, () => (flash.size += this.range)],
      [0.1, () => (flash.size += this.range)],
      [0.18, () => (flash.size -= this.range / 2)],
      [0.2, () => this.destroy(flash)]
    ]);
    return flash;
  }

  affect(bomb, layers) {
    let result = [];
    arrayForEach(layers, layer => {
      layer.entities.forEach(entity => {
        if (this.intersection(bomb, entity)) {
          result.push(entity);
        }
      });
    });
    return result;
  }

  destroy(entity) {
    entity.parent.remove(entity);
  }

  intersection(bomb, entity) {
    return (
      bomb.top - this.range < entity.bottom &&
      bomb.bottom + this.range > entity.top &&
      bomb.right + this.range > entity.left &&
      bomb.left - this.range < entity.right
    );
  }
}

export default Explosive;
