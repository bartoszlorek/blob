import {localToGrid} from '@app/consts';

class Tile {
  constructor(sprite) {
    this.sprite = sprite;
    this.parent = null;
    this.x = localToGrid(sprite.x);
    this.y = localToGrid(sprite.y);
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
