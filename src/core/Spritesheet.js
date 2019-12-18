import {Texture, Rectangle} from 'pixi.js';

class Spritesheet {
  constructor({texture, size = 1}) {
    this._base = texture.baseTexture;
    this._sprites = new Map();

    // parameters
    this.width = this._base.width / size;
    this.height = this._base.height / size;
    this.length = this.width * this.height;
    this._initialize(size);
  }

  getById(id) {
    return this._sprites.get(id - 1);
  }

  destroy() {
    this._base.destroy();
    this._sprites.clear();
  }

  _initialize(size) {
    for (let index = 0; index < this.length; index++) {
      const x = index % this.width;
      const y = Math.floor(index / this.width);

      const rect = new Rectangle(x * size, y * size, size, size);
      this._sprites.set(index, new Texture(this._base, rect));
    }
  }
}

export default Spritesheet;
