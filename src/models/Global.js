import {localToGrid} from '@app/consts';
import Events from '@models/Events';

class Global {
  constructor({engine, assets}) {
    this.engine = engine;
    this.assets = assets;
    this.scene = null;

    // parameters
    this.time = 1 / 60;

    this.events = new Events();
    this.events.onResize(() => this.resize());
    this.resize();
  }

  tick(callback) {
    this.engine.ticker.add(deltaFrame => {
      const deltaTime = deltaFrame * this.time;
      this.scene.update(deltaTime);
      callback(deltaTime);
    });
  }

  load(scene) {
    if (this.scene !== null) {
      this.unload();
    }
    this.scene = scene;
    this.scene.create();

    this.engine.stage.addChild(scene.graphics);
    this.events.publish('load_scene', this);
    this.engine.ticker.start();
  }

  unload() {
    this.engine.ticker.stop();
    this.events.publish('before_unload_scene', this);
    this.engine.stage.removeChild(this.scene.graphics);

    this.scene.destroy();
    this.scene = null;
  }

  resize() {
    const {innerWidth, innerHeight} = window;
    this.engine.renderer.resize(innerWidth, innerHeight);
    this.rootX = Math.round(innerWidth / 2);
    this.rootY = Math.round(innerHeight / 2);
  }

  localToGlobalX(x) {
    return x + this.rootX + this.scene.offsetX;
  }

  localToGlobalY(y) {
    return y + this.rootY + this.scene.offsetY;
  }

  globalToLocalX(x) {
    return x - this.rootX - this.scene.offsetX;
  }

  globalToLocalY(y) {
    return y - this.rootY - this.scene.offsetY;
  }

  globalToGridX(x) {
    return localToGrid(this.globalToLocalX(x));
  }

  globalToGridY(y) {
    return localToGrid(this.globalToLocalY(y));
  }
}

export default Global;
