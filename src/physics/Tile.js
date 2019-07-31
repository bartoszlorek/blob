import {baseSize, localToGrid} from '@app/consts';

class Tile {
  constructor(sprite) {
    this.sprite = sprite;
    this.parent = null;

    const {x, y} = sprite;
    this.x = localToGrid(x);
    this.y = localToGrid(y);
    this.minX = x;
    this.minY = y;
    this.maxX = x + baseSize;
    this.maxY = y + baseSize;
  }

  destroy() {
    if (this.parent) {
      this.parent.remove(this);
      this.parent = null;
    }
    this.sprite.destroy();
    this.sprite = null;
  }
}

export default Tile;
