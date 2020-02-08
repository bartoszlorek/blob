// @flow strict

import type PIXI from 'pixi.js';
import type Animations from '@core/Animations';
import type Spriteset from '@core/structure/Spriteset';

export type KeyframesType = {
  [name: string]: {
    frame: number,
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
  callback: AnimationCallback | null;

  constructor(sprite: PIXI.Sprite, keyframes: KeyframesType = {}) {
    this.sprite = sprite;
    this.parent = null;
    this.keyframes = keyframes;
    this.playing = null;
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

    const {frame, firstId, lastId} = keyframes;
    const frameId = firstId + frame;
    this.sprite.texture = spritesheet.getById(frameId);

    if (frameId + 1 > lastId) {
      if (this.callback !== null) {
        this.callback(this);
      }
      keyframes.frame = 0;
    } else {
      keyframes.frame = frame + 1;
    }
  }

  play(name: string, callback: AnimationCallback | null = null) {
    this.playing = name;
    this.callback = callback;
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
    this.callback = null;
  }
}

export default Animation;
