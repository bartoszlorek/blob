// @flow strict

import {Texture, Rectangle} from 'pixi.js';
import type PIXI from 'pixi.js';

export type BaseSpritesheet = {|
  baseTexture: PIXI.BaseTexture,
  tilewidth: number,
  tilesize: number,
  firstId: number,
  lastId: number,
|};

class Spritesheet {
  registry: Map<number, Texture>;
  tilesets: Array<BaseSpritesheet>;

  constructor(tilesets: Array<BaseSpritesheet>) {
    this.registry = new Map();
    this.tilesets = tilesets;
  }

  getById(id: number) {
    if (this.registry.has(id)) {
      return this.registry.get(id);
    }

    for (let i = 0; i < this.tilesets.length; i++) {
      const tileset = this.tilesets[i];

      if (tileset.firstId <= id && tileset.lastId >= id) {
        return this.getTexture(id, tileset);
      }
    }
  }

  getTexture(id: number, tileset: BaseSpritesheet) {
    const {baseTexture, tilewidth, tilesize, firstId} = tileset;

    const index = id - firstId;
    const x = index % tilewidth;
    const y = Math.floor(index / tilewidth);

    const rect = new Rectangle(x * tilesize, y * tilesize, tilesize, tilesize);
    const texture = new Texture(baseTexture, rect);

    this.registry.set(id, texture);
    return texture;
  }

  destroy() {
    this.registry.clear();
  }
}

export default Spritesheet;
