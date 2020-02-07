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

class Animation {
  sprite: PIXI.Sprite;
  parent: Animations | null;
  keyframes: KeyframesType;
  playing: string | null;

  constructor(sprite: PIXI.Sprite, keyframes: KeyframesType = {}) {
    this.sprite = sprite;
    this.parent = null;
    this.keyframes = keyframes;
    this.playing = null;
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
    keyframes.frame = frameId + 1 > lastId ? 0 : frame + 1;
  }

  play(name: string) {
    this.playing = name;
  }

  stop() {
    this.playing = null;
  }

  destroy() {
    if (this.parent) {
      this.parent.removeSprite(this.sprite);
    }
    this.sprite = null;
  }
}

export default Animation;
