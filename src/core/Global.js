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
  delta: number;
  centerX: number;
  centerY: number;

  constructor(engine: PIXI.Application) {
    this.engine = engine;
    this.events = new EventEmitter<EventType>();
    this.scene = null;

    // framerate independent movement/physics
    this.delta = 1 / 60;

    // global events
    fromEvent(window, 'resize').subscribe(() => {
      this.events.emit('global/resize');
      this.resize();
    });

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
      const deltaTime = deltaFrame * this.delta;
      this.scene.update(deltaTime);
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
    this.engine.ticker.add(this.ticker, this);
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
    this.engine.ticker.remove(this.ticker, this);
    this.stop();

    // cleanup
    scene.destroy();
    this.scene = null;
  }
}

export default Global;
