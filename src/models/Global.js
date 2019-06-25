import Events from '@models/Events';

class Global {
  constructor({app, size = 24}) {
    this.app = app;
    this.size = size;
    this.level = null;

    // parameters
    this.time = 1 / 60;

    this.events = new Events();
    this.events.onResize(() => this.resize());
    this.resize();
  }

  tick(callback) {
    this.app.ticker.add(deltaFrame => {
      const deltaTime = deltaFrame * this.time;
      callback(deltaTime);
    });
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
    this.level = level;
    level.onLoad(this);
    this.app.stage.addChild(level.elements);
    this.events.publish('load_level', this);
  }

  unload() {
    this.level = null;
    this.level.onUnload();
    this.app.stage.removeChild(this.level.elements);
    this.events.publish('unload_level', this);
  }

  gridToLocal(pos) {
    return pos * this.size;
  }

  localToGrid(pos) {
    return Math.round(pos / this.size) || 0;
  }

  localToGlobalX(x) {
    return x + this.rootX;
  }

  localToGlobalY(y) {
    return y + this.rootY;
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
