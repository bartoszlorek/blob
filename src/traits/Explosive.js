import {baseSize} from '@app/consts';
import {arrayForEach} from '@utils/array';

import Sprite from '@models/Sprite';
import Trait from '@traits/Trait';

class Explosive extends Trait {
  constructor({global, scene}) {
    super('explosive');
    this.global = global;
    this.scene = scene;
    this.active = false;

    // parameters
    this.range = 1;
    this.delay = 0.25;

    // object pools
    this._bodySearch = {};
  }

  ignite() {
    if (!this.active) {
      this.active = true;
      console.log('fire up');
    }
  }

  update(entity, deltaTime) {
    if (!this.active) {
      return;
    }

    if (this.delay < 0) {
      const {player, ground, effects} = this.scene.refs;
      effects.addChild(this._createBlastFrom(entity));

      // destroy everything in range
      this._updateBodySearch(entity);
      this._destroyTilemap(entity, ground);
      this._destroyBodies(player);
      entity.destroy();

      if (!player.isAlive) {
        this.global.events.publish('player_dead');
      }
    }
    this.delay -= deltaTime;
  }

  _destroyTilemap(entity, tilemap) {
    const closest = tilemap.closest(entity.gridX, entity.gridY);
    arrayForEach(closest, tile => tile && tile.destroy());
  }

  _destroyBodies(elem) {
    const closest = this.scene.physics.searchBodies(this._bodySearch);
    arrayForEach(closest, body => {
      if (elem === body || (elem.isGroup && elem.contains(child))) {
        body.destroy();
      }
    });
  }

  _updateBodySearch(entity) {
    const offset = baseSize * this.range;
    this._bodySearch = {
      minX: entity.minX - offset,
      maxX: entity.maxX + offset,
      minY: entity.minY - offset,
      maxY: entity.maxY + offset
    };
  }

  _createBlastFrom(entity) {
    const {texture} = this.global.assets['blast'];
    const blast = new Sprite(texture, entity.gridX, entity.gridY);
    // let scale = 1;

    // blast.addTrait(new Animation());
    // blast.animation.add('explode', [
    //   [10, () => (blast.scale = scale += this.range)],
    //   [100, () => (blast.scale = scale += this.range)],
    //   [200, () => (blast.scale = scale -= this.range / 2)],
    //   [250, () => blast.remove()]
    // ]);
    // blast.animation.explode.play();
    return blast;
  }
}

export default Explosive;
