import {Container} from 'pixi.js';
import {baseSize} from '@app/consts';
import {lerp} from '@utils/math';

import Background from '@models/Background';

const cameraRadius = 100;
const cameraSpeed = 0.01;

class Scene {
  constructor(name, global) {
    this.name = name;
    this.global = global;
    this.layers = {};

    this.offsetX = 0;
    this.offsetY = 0;

    this.background = new Background();
    this.foreground = new Container();

    this.elements = new Container();
    this.elements.addChild(this.background.sprite);
    this.elements.addChild(this.foreground);

    // events
    this.resize = this.resize.bind(this);
    this.global.events.onResize(this.resize);
  }

  get player() {
    return (this.layers.player && this.layers.player.children[0]) || null;
  }

  destroy() {
    this.global.events.unsubscribe('resize', this.resize());
  }

  update(deltaTime) {
    const names = Object.keys(this.layers);
    let i = names.length;

    while (i > 0) {
      this.layers[names[--i]].update(deltaTime);
    }
  }

  resize() {
    this.foreground.x = this.global.rootX;
    this.foreground.y = this.global.rootY;
    this.background.resize();
  }

  focus(entity, easeing = true) {
    if (!entity) {
      return;
    }

    const {x, y} = entity.sprite;

    if (easeing) {
      const a = x + this.offsetX;
      const b = y + this.offsetY;
      const distance = Math.sqrt(a * a + b * b);

      if (distance < baseSize) {
        return;
      }
      const factor = Math.min(1, distance / cameraRadius);
      this.offsetX = lerp(this.offsetX, -x, cameraSpeed * factor);
      this.offsetY = lerp(this.offsetY, -y, cameraSpeed * factor);
    } else {
      this.offsetX = -x;
      this.offsetY = -y;
    }

    // apply offset to visible elements
    this.foreground.x = this.global.rootX + this.offsetX;
    this.foreground.y = this.global.rootY + this.offsetY;
  }
}

export default Scene;
