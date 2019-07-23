import {Container} from 'pixi.js';
import {baseSize} from '@app/consts';
import {lerp} from '@utils/math';
import {arrayForEach} from '@utils/array';

import layerCreators from '@layers';
import PhysicsEngine from '@models/PhysicsEngine';
import Background from '@models/Background';

const cameraRadius = 100;
const cameraSpeed = 0.01;

class Level {
  constructor(data) {
    this.data = data;
    this.name = data.name;
    this.global = null;
    this.layers = {};

    this.resize = this.resize.bind(this);
    this.physics = new PhysicsEngine();
    this.background = new Background();
    this.foreground = new Container();

    this.elements = new Container();
    this.elements.addChild(this.background.sprite);
    this.elements.addChild(this.foreground);

    this.offsetX = 0;
    this.offsetY = 0;
  }

  get player() {
    return (this.layers.player && this.layers.player.children[0]) || null;
  }

  load(global) {
    const {layers, background} = this.data;
    const layerNames = Object.keys(layers);

    if (background) {
      this.background.set(global.assets[background].texture);
    }
    this.global = global;
    this.global.events.onResize(this.resize);
    this.resize();

    // layers
    arrayForEach(layerNames, name => {
      const create = layerCreators[name];

      if (!create) {
        return;
      }
      const layer = create(layers, global, this);
      this.foreground.addChild(layer.graphics);
      this.layers[name] = layer;

      if (name === 'ground') {
        this.physics.addGravitation(layer);
      }
    });

    this.physics.setCollisions(this.layers);
    this.focus(this.player, false);
  }

  destroy() {
    this.global.events.unsubscribe('resize', this.resize);
    this.global = null;
  }

  update(deltaTime) {
    const names = Object.keys(this.layers);
    let i = names.length;
    let j = names.length;

    // update phase: velocity and visible traits
    // like animations or colors apply here
    while (i > 0) {
      this.layers[names[--i]].update(deltaTime);
    }

    // physics phase: velocity changes the position
    // of entities based on collision and gravity
    this.physics.update(deltaTime);

    // post-update phase: remember layers state
    // to optimize searching in the next cycle
    while (j > 0) {
      this.layers[names[--j]].postUpdate();
    }

    // post-processes
    this.focus(this.player);
  }

  resize() {
    this.foreground.x = this.global.rootX;
    this.foreground.y = this.global.rootY;
    this.background.resize();
  }

  focus(entity, easeing = true) {
    if (!entity || !this.global) {
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

export default Level;
