import {Texture} from 'pixi.js';
import Events from '@models/Events';

class Global {
  constructor({engine, assets, size = 24}) {
    this.engine = engine;
    this.assets = assets;
    this.size = size;
    this.level = null;

    // parameters
    this.time = 1 / 60;

    this.events = new Events();
    this.events.onResize(() => this.resize());
    this.resize();
  }

  tick(callback) {
    this.engine.ticker.add(deltaFrame => {
      const deltaTime = deltaFrame * this.time;
      callback(deltaTime);
    });
  }

  resize() {
    this.engine.renderer.resize(window.innerWidth, window.innerHeight);
    this.rootX = this.engine.screen.width / 2;
    this.rootY = this.engine.screen.height / 2;

    if (this.level) {
      this.level.resize();
    }
  }

  mount(level) {
    if (this.level !== null) {
      this.unmount();
    }
    this.level = level;
    level.onMount(this);
    this.engine.stage.addChild(level.elements);
    this.events.publish('mount_level', this);
  }

  unmount() {
    this.level = null;
    this.level.onUnmount();
    this.engine.stage.removeChild(this.level.elements);
    this.events.publish('unmount_level', this);
  }

  gridToLocal(pos) {
    return pos * this.size;
  }

  localToGrid(pos) {
    return Math.round(pos / this.size) || 0;
  }

  localToGlobalX(x) {
    const offsetX = this.level ? this.level.offsetX : 0;
    return x + this.rootX + offsetX;
  }

  localToGlobalY(y) {
    const offsetY = this.level ? this.level.offsetY : 0;
    return y + this.rootY + offsetY;
  }

  globalToLocalX(x) {
    const offsetX = this.level ? this.level.offsetX : 0;
    return x - this.rootX - offsetX;
  }

  globalToLocalY(y) {
    const offsetY = this.level ? this.level.offsetY : 0;
    return y - this.rootY - offsetY;
  }

  globalToGridX(x) {
    return this.localToGrid(this.globalToLocalX(x));
  }

  globalToGridY(y) {
    return this.localToGrid(this.globalToLocalY(y));
  }
}

export default Global;
