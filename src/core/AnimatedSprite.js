// @flow strict

import {Sprite} from 'pixi.js';
import Animation from '@core/Animation';

import type PIXI from 'pixi.js';

class AnimatedSprite extends Sprite {
  constructor(texture: PIXI.Texture) {
    super(texture);
    this.animation = new Animation(this);
  }

  destroy() {
    this.animation.destroy();
    this.animation = null;
    super.destroy();
  }
}

export default AnimatedSprite;
