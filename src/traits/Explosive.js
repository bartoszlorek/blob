// @flow strict

import {baseSize} from '@app/constants';
import BoundingBox from '@core/BoundingBox';
import Trait from '@core/Trait';

import type Global from '@core/Global';
import type Body from '@core/physics/Body';

const destoryTilemap = (value, index, tilemap) => {
  tilemap.removeByIndex(index);
};

class Explosive extends Trait {
  global: Global;
  active: boolean;

  area: BoundingBox;
  range: number;
  timer: number;
  delay: number;

  constructor(global: Global, range: number = baseSize) {
    super('explosive');
    this.global = global;
    this.active = false;

    const size = range * 2 + baseSize;
    this.area = new BoundingBox([0, 0], [size, size]);
    this.range = range;
    this.timer = 0;

    // parameters
    this.delay = 0.3;
  }

  ignite() {
    this.active = true;
  }

  update(bomb: Body, deltaTime: number) {
    if (this.active === false) {
      return;
    }

    const scene = this.global.scene;
    if (!scene) {
      return;
    }

    if (this.timer === 0) {
      // todo: start animation
    }

    if (this.timer >= this.delay) {
      const {player, ground} = scene.refs || {};

      this.area.alignX(bomb.min[0] - this.range);
      this.area.alignY(bomb.min[1] - this.range);

      // todo: add blast sprite
      bomb.destroy();
      ground.search(this.area, destoryTilemap);
      scene.camera.shake();

      if (this.area.intersects(player)) {
        this.global.events.emit('player/dead');
        player.destroy();
      }
    }

    this.timer += deltaTime;
  }
}

export default Explosive;
