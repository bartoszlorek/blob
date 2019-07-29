class Tilemap {
  constructor(width, offset = 0) {
    this.width = width;
    this.offset = offset;
    this.tiles = [];
    this.isTilemap = true;
  }

  add(tile) {
    this.tiles[this._index(tile.x, tile.y)] = tile;
    tile.parent = this;
  }

  remove(tile) {
    this.tiles[this._index(tile.x, tile.y)] = null;
  }

  has(x, y) {
    return !!this.tiles[this._index(x, y)];
  }

  _index(x, y) {
    return (y - this.offset) * this.width + x - this.offset;
  }
}

export default Tilemap;
