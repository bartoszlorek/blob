import {fromEvent} from 'rxjs';
import EventEmitter from '@core/EventEmitter';

class Global {
  constructor(engine) {
    this.engine = engine;
    this.scene = null;

    // parameters
    this.time = 1 / 60;

    // global events
    this.events = new EventEmitter();

    fromEvent(window, 'resize').subscribe(() => {
      this.events.emit('global/resize');
      this.resize();
    });

    this.engine.ticker.add(deltaFrame => {
      const deltaTime = deltaFrame * this.time;
      this.scene.update(deltaTime);
    });

    this.resize();
    this.stop();
  }

  stop() {
    this.engine.ticker.stop();
  }

  start() {
    this.engine.ticker.start();
  }

  load(scene) {
    if (this.scene !== null) {
      this.unload();
    }
    this.scene = scene;
    this.scene.create(this);

    this.engine.stage.addChild(scene.graphics);
    this.events.emit('global/load', this);
    this.start();
  }

  unload() {
    this.stop();
    this.events.emit('global/beforeunload', this);
    this.engine.stage.removeChild(this.scene.graphics);

    this.scene.destroy();
    this.scene = null;
  }

  resize() {
    const {innerWidth, innerHeight} = window;
    this.engine.renderer.resize(innerWidth, innerHeight);
    this.centerX = Math.round(innerWidth / 2);
    this.centerY = Math.round(innerHeight / 2);
  }
}

export default Global;
