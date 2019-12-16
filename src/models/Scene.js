import {Container} from 'pixi.js';
import {baseSize} from '@app/consts';
import {lerp} from '@utils/math';

import World from '@physics/core/World';
import Background from '@models/Background';

class Scene {
  constructor(global) {
    this.global = global;
    this.refs = {};

    // physics
    this.physics = new World();

    // pixijs layers di
    this.background = new Background();
    this.foreground = new Container();

    this.graphics = new Container();
    this.graphics.addChild(this.background.sprite);
    this.graphics.addChild(this.foreground);

    // events
    this.resize = this.resize.bind(this);
    this.global.events.onResize(this.resize);

    // parameters
    this.offsetX = 0;
    this.offsetY = 0;
    this.cameraRadius = 100;
    this.cameraSpeed = 0.01;
  }

  create() {
    // call in subclass
  }

  update() {
    // call in subclass
  }

  cleanup() {
    // call in subclass
  }

  add(elem) {
    if (!elem) {
      return;
    }
    // prettier-ignore
    if (elem.isBody) {
      this.foreground.addChild(elem.sprite);

    } else if (elem.isGroup) {
      elem.children.forEach(child => this.add(child));

    } else if (elem.isTilemap) {
      this.foreground.addChild(elem.graphics);

    } else {
      this.foreground.addChild(elem);
    }
  }

  resize() {
    this.foreground.x = this.global.rootX + this.offsetX;
    this.foreground.y = this.global.rootY + this.offsetY;
    this.background.resize();
  }

  focus(body) {
    const {x, y} = body.sprite;
    this.offsetX = -x;
    this.offsetY = -y;
    this.foreground.x = this.global.rootX + this.offsetX;
    this.foreground.y = this.global.rootY + this.offsetY;
  }

  follow(body) {
    if (!body) {
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
    this.foreground.x = this.global.rootX + this.offsetX;
    this.foreground.y = this.global.rootY + this.offsetY;
  }

  destroy() {
    this.cleanup();
    this.global.events.unsubscribe('resize', this.resize);
    this.global = null;
    this.refs = null;
  }
}

export default Scene;
