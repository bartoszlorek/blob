import {Container} from 'pixi.js';
import {baseSize} from '@app/constants';
import {lerp} from '@utils/math';
import Background from '@core/Background';
import World from '@core/physics/World';

class Scene {
  constructor(global, spriteset) {
    this.global = global;
    this.spriteset = spriteset;
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
    this.global.events.on('resize', this.resize);

    // parameters
    this.offsetX = 0;
    this.offsetY = 0;
    this.cameraRadius = 100;
    this.cameraSpeed = 0.01;
  }

  create() {
    // fill in subclass
  }

  update() {
    // fill in subclass
  }

  cleanup() {
    // fill in subclass
  }

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
    const {width, height, tilesize} = this.spriteset;
    const left = this.global.rootX - (width / 2) * tilesize;
    const top = this.global.rootY - (height / 2) * tilesize;

    this.foreground.x = left + this.offsetX;
    this.foreground.y = top + this.offsetY;
    this.background.resize();
  }

  focus(body) {
    if (!body.isAlive) {
      return;
    }
    const {x, y} = body.sprite;
    this.offsetX = -x;
    this.offsetY = -y;
    this.foreground.x = this.global.rootX + this.offsetX;
    this.foreground.y = this.global.rootY + this.offsetY;
  }

  follow(body) {
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
    this.foreground.x = this.global.rootX + this.offsetX;
    this.foreground.y = this.global.rootY + this.offsetY;
  }

  destroy() {
    this.cleanup();
    this.global.events.off('resize', this.resize);
    this.global = null;
    this.refs = null;
  }
}

export default Scene;
