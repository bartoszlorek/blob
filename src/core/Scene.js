// @flow strict

import {Container} from 'pixi.js';
import {baseSize} from '@app/constants';
import {lerp} from '@utils/math';
import Background from '@core/Background';
import World from '@core/physics/World';

import type Body from '@core/physics/Body';
import type Global from '@core/Global';
import type Spriteset from '@core/structure/Spriteset';

class Scene {
  global: Global | null;
  spriteset: Spriteset;
  refs: {[name: string]: mixed} | null;
  resize: () => void;

  physics: World;
  background: Background;
  foreground: Container;
  graphics: Container;

  cameraRadius: number;
  cameraSpeed: number;
  cameraOffsetX: number;
  cameraOffsetY: number;
  offsetX: number;
  offsetY: number;

  constructor(global: Global, spriteset: Spriteset) {
    this.global = global;
    this.spriteset = spriteset;
    this.refs = {};

    // physics
    this.physics = new World();

    // pixijs layers di
    this.background = new Background(spriteset);
    this.foreground = new Container();

    this.graphics = new Container();
    this.graphics.addChild(this.background.graphics);
    this.graphics.addChild(this.foreground);

    // events
    this.resize = this.resize.bind(this);
    global.events.on('global/resize', this.resize);

    // camera
    this.cameraRadius = 100;
    this.cameraSpeed = 0.01;
    this.cameraOffsetX = 0;
    this.cameraOffsetY = 0;

    // position
    this.offsetX = -((spriteset.width / 2) * spriteset.tilesize);
    this.offsetY = -((spriteset.height / 2) * spriteset.tilesize);
    this.resize();
  }

  create(global: Global) {
    // fill in subclass
  }

  update(deltaTime: number) {
    // fill in subclass
  }

  cleanup() {
    // fill in subclass
  }

  // $FlowFixMe
  renderChild(child) {
    if (child.isBody) {
      this.foreground.addChild(child.sprite);
    } else if (child.isTileset) {
      this.foreground.addChild(child.graphics);
    } else if (child.isGroup) {
      child.forEach(a => this.renderChild(a));
    } else {
      this.foreground.addChild(child);
    }
  }

  resize() {
    this.updateForegroundPosition();
    this.background.resize();
  }

  focus(body: Body) {
    if (!body.isAlive) {
      return;
    }
    const {x, y} = body.sprite;
    this.offsetX = -x;
    this.offsetY = -y;
    this.updateForegroundPosition();
  }

  follow(body: Body) {
    if (!body.isAlive) {
      return;
    }
    const {x, y} = body.sprite;
    const a = x + this.offsetX;
    const b = y + this.offsetY;
    const distance = Math.sqrt(a * a + b * b);

    if (distance < baseSize) {
      return;
    }
    const factor = Math.min(1, distance / this.cameraRadius);
    this.offsetX = lerp(this.offsetX, -x, this.cameraSpeed * factor);
    this.offsetY = lerp(this.offsetY, -y, this.cameraSpeed * factor);
    this.updateForegroundPosition();
  }

  updateForegroundPosition() {
    if (!this.global) {
      return;
    }
    this.foreground.x = this.global.centerX + this.offsetX + this.cameraOffsetX;
    this.foreground.y = this.global.centerY + this.offsetY + this.cameraOffsetY;
  }

  destroy() {
    if (this.global) {
      this.global.events.off('global/resize', this.resize);
    }
    this.cleanup();
    this.global = null;
    this.refs = null;
  }
}

export default Scene;
