// @flow strict

import type PIXI from 'pixi.js';
import type Animations from '@core/Animations';
import type Spriteset from '@core/structure/Spriteset';

export type KeyframesType = {
  [name: string]: {
    frame: number,
    delay?: number,
    firstId: number,
    lastId: number,
  },
};

type AnimationCallback = (animation: Animation) => mixed;

class Animation {
  sprite: PIXI.Sprite;
  parent: Animations | null;
  keyframes: KeyframesType;

  playing: string | null;
  iterations: number;
  callback: AnimationCallback | null;

  constructor(sprite: PIXI.Sprite, keyframes: KeyframesType = {}) {
    this.sprite = sprite;
    this.parent = null;
    this.keyframes = keyframes;

    this.playing = null;
    this.iterations = 0; // 0 equals infinity
    this.callback = null;
  }

  update({spritesheet}: Spriteset) {
    if (this.playing === null) {
      return;
    }
    const keyframes = this.keyframes[this.playing];

    if (keyframes === undefined) {
      throw Error(`missing '${this.playing}' animation keyframes`);
    }

    const {frame, delay = 0, firstId, lastId} = keyframes;
    const currentFrame = frame - delay;

    if (currentFrame >= 0) {
      const currentFrameId = firstId + currentFrame;
      this.sprite.texture = spritesheet.getById(currentFrameId);

      if (currentFrameId + 1 > lastId) {
        if (this.iterations > 0) {
          this.iterations -= 1;

          if (!this.iterations && this.callback) {
            this.callback(this);
          }
        }

        keyframes.frame = -delay;
        return;
      }
    }
    keyframes.frame += 1;
  }

  play(name: string, iterations?: number = 0, callback?: AnimationCallback) {
    this.playing = name;
    this.iterations = iterations;
    this.callback = callback || null;
  }

  stop() {
    this.playing = null;
    this.callback = null;
  }

  destroy() {
    if (this.parent) {
      this.parent.removeSprite(this.sprite);
    }
    this.sprite = null;
    this.playing = null;
    this.callback = null;
  }
}

export default Animation;
