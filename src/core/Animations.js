// @flow strict

import {arrayRemove} from '@utils/array';

import type AnimatedSprite from './AnimatedSprite';
import type Spriteset from '@core/structure/Spriteset';

class Animations {
  +msPerFrame: number;
  spriteset: Spriteset;
  sprites: Array<AnimatedSprite>;
  timer: number;

  constructor(frameRate: number, spriteset: Spriteset) {
    this.msPerFrame = 1 / frameRate;
    this.spriteset = spriteset;
    this.sprites = [];
    this.timer = 0;
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
    if (this.timer >= this.msPerFrame) {
      this.timer = 0;

      // it goes backward because of possible
      // changes in each animation callback
      let index = this.sprites.length;

      while (index > 0) {
        this.sprites[--index].animation.update(this.spriteset);
      }
    }
    this.timer += deltaTime;
  }

  destroy() {
    // todo: destroy sprites.animation
    this.sprites = [];
  }
}

export default Animations;
