import {Container} from 'pixi.js';
import {baseSize} from '@app/consts';
import {lerp} from '@utils/math';
import Background from '@models/Background';
import World from '@physics/World';

class Scene {
  constructor(name, global, data) {
    this.name = name;
    this.data = data;
    this.refs = {};

    this.global = global;
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

  add(elem) {
    if (!elem) {
      return;
    }

    // prettier-ignore
    if (elem.isBody) {
      this.foreground.addChild(elem.sprite);

    } else if (elem.isGroup) {
      elem.children.forEach(child => {
        this.add(child);
      });
    } else if (elem.isTilemap) {
      for (let tile of elem.tiles.values()) {
        this.foreground.addChild(tile.sprite);
      }
    } else {
      this.foreground.addChild(elem);
    }
  }

  create() {
    // call in subclass
  }

  update(deltaTime) {
    // call in subclass
  }

  resize() {
    this.foreground.x = this.global.rootX + this.offsetX;
    this.foreground.y = this.global.rootY + this.offsetY;
    this.background.resize();
  }

  focus(body) {
    const {x, y} = body.position;
    this.offsetX = -x;
    this.offsetY = -y;
    this.foreground.x = this.global.rootX + this.offsetX;
    this.foreground.y = this.global.rootY + this.offsetY;
  }

  follow(body) {
    if (!body) {
      return;
    }
    const {x, y} = body.position;
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
    this.global.events.unsubscribe('resize', this.resize);
    this.global = null;
    this.physics = null;
    this.refs = null;
  }
}

export default Scene;
