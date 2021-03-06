// @flow strict

import {fromEvent} from 'rxjs';
import EventEmitter from '@core/EventEmitter';
import Scene from '@core/Scene';

import type PIXI from 'pixi.js';
import type {EventType} from './types';

class Global {
  engine: PIXI.Application;
  events: EventEmitter<EventType>;
  scene: Scene | null;

  accumulatedTime: number;
  deltaTime: number;
  centerX: number;
  centerY: number;

  constructor(engine: PIXI.Application) {
    this.engine = engine;
    this.events = new EventEmitter<EventType>();
    this.scene = null;

    this.accumulatedTime = 0;
    this.deltaTime = 1 / 60;

    // global events
    fromEvent(window, 'resize').subscribe(() => {
      this.events.emit('global/resize');
      this.resize();
    });

    this.engine.ticker.add(this.ticker, this);
    this.stop();
    this.resize();
  }

  stop() {
    this.engine.ticker.stop();
  }

  start() {
    this.engine.ticker.start();
  }

  ticker(deltaFrame: number) {
    if (this.scene) {
      this.accumulatedTime += this.deltaTime * deltaFrame;

      // framerate independent movement/physics
      while (this.accumulatedTime > this.deltaTime) {
        this.scene.update(this.deltaTime);
        this.events.emit('global/tick', this.deltaTime);
        this.accumulatedTime -= this.deltaTime;
      }
    }
  }

  resize() {
    const {innerWidth, innerHeight} = window;
    this.engine.renderer.resize(innerWidth, innerHeight);
    this.centerX = Math.round(innerWidth / 2);
    this.centerY = Math.round(innerHeight / 2);
  }

  load(scene: Scene) {
    if (this.scene !== null) {
      this.unload();
    }
    this.scene = scene;
    this.scene.create(this);

    // setup new scene
    this.engine.stage.addChild(scene.graphics);
    this.events.emit('global/load', this);
    this.start();
  }

  unload() {
    if (this.scene === null) {
      return;
    }
    const scene = this.scene;
    this.events.emit('global/beforeunload', this);
    this.engine.stage.removeChild(scene.graphics);
    this.stop();

    // cleanup
    scene.destroy();
    this.scene = null;
  }

  enableDeadMode() {
    if (document.body) {
      document.body.classList.add('dead-mode');
    }
  }

  disableDeadMode() {
    if (document.body) {
      document.body.classList.remove('dead-mode');
    }
  }

  globalToLocalX(x: number) {
    return x - this.centerX - (this.scene ? this.scene.offsetX : 0);
  }

  globalToLocalY(y: number) {
    return y - this.centerY - (this.scene ? this.scene.offsetY : 0);
  }
}

export default Global;
