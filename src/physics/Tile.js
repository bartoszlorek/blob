import {localToGrid} from '@app/consts';

class Tile {
  constructor(sprite, x, y) {
    this.parent = null;
    this.sprite = sprite;
    this.x = x;
    this.y = y;
  }

  static from(sprite) {
    const x = localToGrid(sprite.x);
    const y = localToGrid(sprite.y);
    return new Tile(sprite, x, y);
  }

  destroy() {
    if (this.parent) {
      this.parent.remove(this);
      this.parent = null;
      this.sprite = null;
    }
  }
}

export default Tile;
