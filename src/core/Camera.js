// @flow strict

import {lerp} from '@utils/math';

import type Global from '@core/Global';
import type Body from '@core/physics/Body';

class Camera {
  global: Global;
  delay: number;
  margin: number;
  x: number;
  y: number;

  constructor(global: Global, delay: number, margin: number) {
    this.global = global;
    this.delay = delay;
    this.margin = margin;
    this.x = 0;
    this.y = 0;
  }

  focus(body: Body) {
    if (body.alive && this.global.scene) {
      const {offsetX, offsetY} = this.global.scene;
      this.x = -(body.min[0] + body.width / 2) - offsetX;
      this.y = -(body.min[1] + body.height / 2) - offsetY;
    }
  }

  simpleFollow(body: Body) {
    if (!body.alive || !this.global.scene) {
      return;
    }
    const {offsetX, offsetY} = this.global.scene;
    const targetX = -(body.min[0] + body.width / 2) - offsetX;
    const targetY = -(body.min[1] + body.height / 2) - offsetY;
    this.x = lerp(this.x, targetX, this.delay);
    this.y = lerp(this.y, targetY, this.delay);
  }

  follow(body: Body) {
    if (!body.alive || !this.global.scene) {
      return;
    }
    const {centerX, centerY} = this.global;
    const {offsetX, offsetY} = this.global.scene;

    const left = body.min[0] + offsetX + centerX;
    const leftDiff = this.margin - left;

    if (leftDiff > 0) {
      this.x = lerp(this.x, leftDiff, this.delay);
    } else {
      const right = body.max[0] + offsetX + centerX;
      const rightDiff = window.innerWidth - this.margin - right;

      if (rightDiff < 0) {
        this.x = lerp(this.x, rightDiff, this.delay);
      } else if (this.x !== 0) {
        this.x = lerp(this.x, 0, this.delay);
      }
    }

    const top = body.min[1] + offsetY + centerY;
    const topDiff = this.margin - top;

    if (topDiff > 0) {
      this.y = lerp(this.y, topDiff, this.delay);
    } else {
      const bottom = body.max[1] + offsetY + centerY;
      const bottomDiff = window.innerHeight - this.margin - bottom;

      if (bottomDiff < 0) {
        this.y = lerp(this.y, bottomDiff, this.delay);
      } else if (this.y !== 0) {
        this.y = lerp(this.y, 0, this.delay);
      }
    }
  }
}

export default Camera;
