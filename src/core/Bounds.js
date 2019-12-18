class Bounds {
  constructor() {
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
  }

  add(x, y) {
    this.minX = Math.min(this.minX, x);
    this.maxX = Math.max(this.maxX, x);
    this.minY = Math.min(this.minY, y);
    this.maxY = Math.max(this.maxY, y);
  }

  contains(x, y, margin = 0) {
    return !(
      x < this.minX - margin ||
      x > this.maxX + margin ||
      y < this.minY - margin ||
      y > this.maxY + margin
    );
  }

  clear() {
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
  }
}

export default Bounds;
