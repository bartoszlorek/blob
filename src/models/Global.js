import Events from '@models/Events';

class Global {
  constructor(app, state, size = 32) {
    this.app = app;
    this.state = state;
    this.size = size;
    this.time = 1 / 60;
    this.level = null;

    this.events = new Events();
    this.events.onResize(() => this.resize());
    this.resize();
  }

  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.rootX = this.app.screen.width / 2;
    this.rootY = this.app.screen.height / 2;

    if (this.level) {
      this.level.resize();
    }
  }

  load(level) {
    if (this.level !== null) {
      this.unload();
    }
    this.app.stage.addChild(level.elements);
    this.level = level;
    level.load(this);
  }

  unload() {
    this.app.stage.removeChild(this.level.elements);
    this.level.unload(this);
    this.level = null;
  }

  gridToLocal(pos) {
    return pos * this.size;
  }

  localToGrid(pos) {
    return Math.round(pos / this.size) || 0;
  }

  globalToLocalX(x) {
    return x - this.rootX;
  }

  globalToLocalY(y) {
    return y - this.rootY;
  }

  globalToGridX(x) {
    return this.localToGrid(this.globalToLocalX(x));
  }

  globalToGridY(y) {
    return this.localToGrid(this.globalToLocalY(y));
  }
}

export default Global;
