// @flow strict

import {arrayRemove} from '@utils/array';

import type AnimatedSprite from './AnimatedSprite';
import type Spriteset from '@core/structure/Spriteset';

class Animations {
  spriteset: Spriteset;
  sprites: Array<AnimatedSprite>;

  frameTime: number;
  accumulatedTime: number;

  constructor(frameRate: number, spriteset: Spriteset) {
    this.spriteset = spriteset;
    this.sprites = [];

    this.frameTime = 1 / frameRate;
    this.accumulatedTime = 0;
  }

  addSprite(sprite: AnimatedSprite) {
    this.sprites.push(sprite);
    sprite.animation.parent = this;
  }

  removeSprite(sprite: AnimatedSprite) {
    arrayRemove(this.sprites, sprite);
    sprite.animation.parent = null;
  }

  requestFrame(deltaTime: number) {
    if (!this.sprites.length) {
      return;
    }
    if (this.accumulatedTime >= this.frameTime) {
      this.accumulatedTime = 0;

      // it goes backward because of possible
      // changes in each animation callback
      let index = this.sprites.length;

      while (index > 0) {
        this.sprites[--index].animation.update(this.spriteset);
      }
    }
    this.accumulatedTime += deltaTime;
  }

  destroy() {
    // todo: destroy sprites.animation
    this.sprites.length = 0;
  }
}

export default Animations;
