// @flow strict

import {Texture, Rectangle} from 'pixi.js';

import type PIXI from 'pixi.js';

class Spritesheet {
  baseTexture: PIXI.BaseTexture;
  width: number;
  tilesize: number;
  tilemap: Map<number, Texture>;

  constructor(texture: Texture, tilesize: number) {
    const {baseTexture} = texture;

    this.baseTexture = baseTexture;
    this.width = baseTexture.width / tilesize;
    this.tilesize = tilesize;
    this.tilemap = new Map();
  }

  getById(id: number) {
    if (this.tilemap.has(id)) {
      return this.tilemap.get(id);
    }

    const index = id - 1;
    const x = index % this.width;
    const y = Math.floor(index / this.width);

    const rect = new Rectangle(
      x * this.tilesize,
      y * this.tilesize,
      this.tilesize,
      this.tilesize
    );

    const texture = new Texture(this.baseTexture, rect);

    this.tilemap.set(id, texture);
    return texture;
  }

  destroy() {
    this.baseTexture.destroy();
    this.tilemap.clear();
  }
}

export default Spritesheet;
