// @flow strict

import {Texture, Rectangle} from 'pixi.js';

import type PIXI from 'pixi.js';

class Spritesheet {
  baseTexture: PIXI.BaseTexture;
  tilemap: Map<number, Texture>;
  tilesize: number;

  width: number;
  firstId: number;
  lastId: number;

  constructor(
    texture: Texture,
    tilesize: number,
    firstId: number = 1,
    lastId: number = Infinity
  ) {
    const {baseTexture} = texture;
    this.baseTexture = baseTexture;
    this.tilemap = new Map();
    this.tilesize = tilesize;

    this.width = baseTexture.width / tilesize;
    this.firstId = firstId;
    this.lastId = lastId;
  }

  getById(id: number) {
    if (this.tilemap.has(id)) {
      return this.tilemap.get(id);
    }

    const index = id - this.firstId;
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
