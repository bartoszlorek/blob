import {localToGrid} from '@app/consts';
import Events from '@models/Events';

class Global {
  constructor({engine, assets}) {
    this.engine = engine;
    this.assets = assets;
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
    const {innerWidth, innerHeight} = window;
    this.engine.renderer.resize(innerWidth, innerHeight);
    this.rootX = Math.round(innerWidth / 2);
    this.rootY = Math.round(innerHeight / 2);
  }

  mount(level) {
    if (this.level !== null) {
      this.unmount();
    }
    this.level = level;
    this.level.onMount(this);
    this.engine.stage.addChild(level.elements);
    this.events.publish('mount_level', this);
  }

  unmount() {
    this.events.publish('unmount_level', this);
    this.engine.stage.removeChild(this.level.elements);
    this.level.onUnmount();
    this.level = null;
  }

  localToGlobalX(x) {
    return x + this.rootX + this.level.offsetX;
  }

  localToGlobalY(y) {
    return y + this.rootY + this.level.offsetY;
  }

  globalToLocalX(x) {
    return x - this.rootX - this.level.offsetX;
  }

  globalToLocalY(y) {
    return y - this.rootY - this.level.offsetY;
  }

  globalToGridX(x) {
    return localToGrid(this.globalToLocalX(x));
  }

  globalToGridY(y) {
    return localToGrid(this.globalToLocalY(y));
  }
}

export default Global;
