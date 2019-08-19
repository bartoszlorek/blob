export class MockEntity {
  constructor(x = 0, y = 0) {
    this.position = {x, y};
    this.velocity = {x: 0, y: 0};
    this.intersection = jest.fn();
  }
  get minX() {
    return this.position.x;
  }
  get maxX() {
    return this.position.x + 24;
  }
  get minY() {
    return this.position.y;
  }
  get maxY() {
    return this.position.y + 24;
  }

  set minX(value) {
    this.position.x = value;
  }
  set minY(value) {
    this.position.y = value;
  }
  set maxX(value) {
    this.position.x = value - 24;
  }
  set maxY(value) {
    this.position.y = value - 24;
  }
}
