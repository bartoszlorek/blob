// @flow strict

import {Container, TilingSprite, Rectangle, Texture} from 'pixi.js';
import type Spriteset from '@core/structure/Spriteset';
import type PIXI from 'pixi.js';

type FragmentType = $ReadOnly<{|
  base: TilingSprite,
  fill: TilingSprite,
  top: number,
  topSlice: number, // [0-1]
  bottom: number,
  bottomSlice: number, // [0-1]
  height: number,
|}>;

class Background {
  tilesize: number;
  graphics: Container;
  fragments: Array<FragmentType>;

  constructor(spriteset: Spriteset) {
    const {tilesize, background} = spriteset;

    this.tilesize = tilesize;
    this.graphics = new Container();
    this.fragments = [];

    // prettier-ignore
    this.setup(
      background.slices,
      background.texture
    );
  }

  setup(slices: Array<number>, texture: PIXI.Texture) {
    this.fragments = [0, ...slices].map((topSlice, index, slices) => {
      const top = topSlice * texture.height;
      const bottomSlice = slices[index + 1] || 1;
      const bottom = bottomSlice * texture.height;
      const height = bottom - top;

      const mask = new Rectangle(
        0,
        bottom - this.tilesize,
        this.tilesize,
        this.tilesize
      );

      const base = new TilingSprite(texture);
      const fill = new TilingSprite(new Texture(texture.baseTexture, mask));
      this.graphics.addChild(base);
      this.graphics.addChild(fill);

      base.height = height;
      base.tilePosition.y = -top;

      return {
        base,
        fill,
        top,
        topSlice,
        bottom,
        bottomSlice,
        height,
      };
    });
  }

  resize() {
    for (let i = 0; i < this.fragments.length; i++) {
      const {base, fill, topSlice, bottomSlice, height} = this.fragments[i];
      const actualTop = this.getSlicePosition(topSlice);
      const actualBottom = this.getSlicePosition(bottomSlice) + this.tilesize;
      const actualHeight = actualBottom - actualTop;

      base.y = actualTop;
      base.width = window.innerWidth;

      if (actualHeight > height) {
        fill.y = actualTop + height;
        fill.width = window.innerWidth;
        fill.height = actualHeight - height;
        fill.visible = true;
      } else {
        fill.visible = false;
      }
    }
  }

  getSlicePosition(slice: number) {
    // prettier-ignore
    return Math.round((slice * window.innerHeight) / this.tilesize) * this.tilesize;
  }
}

export default Background;
