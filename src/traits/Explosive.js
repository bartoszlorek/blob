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
    this._blastArea = {};
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
      this._updateBlastArea(entity);

      this._destroyTilemap(entity, ground);
      this._destroyBodies(player);
      entity.destroy();

      if (!player.isAlive) {
        console.log('dead!');
        // this.global.events.publish('player_dead');
      }
    }
    this.delay -= deltaTime;
  }

  _destroyTilemap(entity, tilemap) {
    const closest = tilemap.closest(entity.gridX, entity.gridY);
    arrayForEach(closest, tile => tile && tile.destroy());
  }

  _destroyBodies(elem) {
    const closest = this.scene.physics.searchBodies(this._blastArea);
    arrayForEach(closest, body => {
      if (elem === body || (elem.isGroup && elem.contains(child))) {
        body.destroy();
      }
    });
  }

  _updateBlastArea(entity) {
    const offset = baseSize * this.range;
    this._blastArea.minX = entity.minX - offset;
    this._blastArea.maxX = entity.maxX + offset;
    this._blastArea.minY = entity.minY - offset;
    this._blastArea.maxY = entity.maxY + offset;
  }

  _createBlastFrom(entity) {
    const {texture} = this.global.assets['blast'];
    return new Sprite(texture, entity.gridX, entity.gridY);
  }
}

export default Explosive;
