import {baseSize} from '@app/consts';
import {arrayForEach} from '@utils/array';

import Animator from '@models/Animator';
import Sprite from '@models/Sprite';
import Action from '@models/Action';

class Explosive extends Action {
  constructor({global, scene}) {
    super('explosive');
    this.global = global;
    this.scene = scene;
    this.active = false;

    // parameters
    this.range = 1;
    this.delay = 0.3;
    this.timer = 0;

    // object pools
    this._blastArea = {};
  }

  ignite() {
    if (!this.active) {
      this.active = true;
    }
  }

  update(entity, deltaTime) {
    if (!this.active) {
      return;
    }

    if (this.timer === 0) {
      entity.sprite.animator.blink.play();
    }

    if (this.timer >= this.delay) {
      const {player, ground} = this.scene.refs;
      this.scene.add(this._createBlastFrom(entity));

      // destroy everything in range
      this._updateBlastArea(entity);
      this._destroyTilemap(entity, ground);
      this._destroyBodies(player);
      entity.destroy();

      if (!player.isAlive) {
        this.global.events.publish('player_dead');
      }
    }

    this.timer += deltaTime;
  }

  _destroyTilemap(entity, tilemap) {
    const closest = tilemap.closest(entity.gridX, entity.gridY);
    arrayForEach(closest, tile => tile && tile.destroy());
  }

  _destroyBodies(elem) {
    const closest = this.scene.physics.treeSearch(this._blastArea);
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
    const sprite = new Sprite(texture, entity.gridX, entity.gridY);

    // todo: put this in sprite
    sprite.anchor.set(0.5);
    sprite.x += baseSize / 2;
    sprite.y += baseSize / 2;

    // animation
    sprite.animator = new Animator();
    sprite.animator.add('blast', [sprite, this.range]);
    sprite.animator.blast.play();

    this.scene.animations.add(sprite);
    return sprite;
  }
}

export default Explosive;
