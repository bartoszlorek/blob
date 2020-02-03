// @flow strict

import {lerp} from '@utils/math';

import type Global from '@core/Global';
import type Body from '@core/physics/Body';

class Camera {
  global: Global;
  delay: number;
  x: number;
  y: number;

  constructor(global: Global, delay: number) {
    this.global = global;
    this.delay = delay;
    this.x = 0;
    this.y = 0;
  }

  focus(body: Body) {
    if (body.alive && this.global.scene) {
      const {offsetX, offsetY} = this.global.scene;
      this.x = -(body.min[0] + body.size / 2) - offsetX;
      this.y = -(body.min[1] + body.size / 2) - offsetY;
    }
  }

  follow(body: Body) {
    if (!body.alive || !this.global.scene) {
      return;
    }
    const {offsetX, offsetY} = this.global.scene;
    const targetX = -(body.min[0] + body.size / 2) - offsetX;
    const targetY = -(body.min[1] + body.size / 2) - offsetY;
    this.x = lerp(this.x, targetX, this.delay);
    this.y = lerp(this.y, targetY, this.delay);
  }
}

export default Camera;
