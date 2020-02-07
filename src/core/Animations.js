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
  }

  removeSprite(sprite: AnimatedSprite) {
    arrayRemove(this.sprites, sprite);
  }

  requestFrame(deltaTime: number) {
    if (!this.sprites.length) {
      return;
    }
    if (this.timer >= this.msPerFrame) {
      this.timer = 0;

      for (let i = 0; i < this.sprites.length; i++) {
        this.sprites[i].animation.update(this.spriteset);
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
