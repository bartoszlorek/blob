// @flow strict

import {Container} from 'pixi.js';
import Animations from '@core/Animations';
import Background from '@core/Background';
import Camera from '@core/Camera';
import World from '@core/physics/World';

import type PIXI from 'pixi.js';
import type Global from '@core/Global';
import type Body from '@core/physics/Body';
import type Group from '@core/physics/Group';
import type Tileset from '@core/structure/Tileset';
import type Spriteset from '@core/structure/Spriteset';

class Scene {
  +offsetX: number;
  +offsetY: number;

  global: Global | null;
  spriteset: Spriteset;
  refs: {[name: string]: any} | null;
  resize: () => void;

  physics: World;
  camera: Camera;
  animations: Animations;

  background: Background;
  foreground: Container;
  graphics: Container;

  constructor(global: Global, spriteset: Spriteset) {
    this.global = global;
    this.spriteset = spriteset;
    this.refs = {};

    this.physics = new World();
    this.camera = new Camera(global, 0.15, 100);
    this.animations = new Animations(10, spriteset);

    // pixijs layers di
    this.background = new Background(spriteset);
    this.foreground = new Container();

    this.graphics = new Container();
    this.graphics.addChild(this.background.graphics);
    this.graphics.addChild(this.foreground);

    // events
    this.resize = this.resize.bind(this);
    global.events.on('global/resize', this.resize);

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

  renderChild(child: Body | Group | Tileset | PIXI.Sprite) {
    if (child.isBody === true) {
      this.foreground.addChild(child.sprite);
      if (child.sprite.animation) {
        this.animations.addSprite(child.sprite);
      }
    } else if (child.isTiles === true) {
      this.foreground.addChild(child.graphics);
    } else if (child.isGroup === true) {
      child.forEach(a => this.renderChild(a));
    } else {
      this.foreground.addChild(child);
      if (child.animation) {
        this.animations.addSprite(child);
      }
    }
  }

  resize() {
    this.background.resize();
    this.updateForeground();
  }

  focus(body: Body) {
    this.camera.focus(body);
    this.updateForeground();
  }

  follow(body: Body) {
    this.camera.follow(body);
    this.updateForeground();
  }

  updateForeground() {
    if (this.global) {
      this.foreground.x = this.global.centerX + this.offsetX + this.camera.x;
      this.foreground.y = this.global.centerY + this.offsetY + this.camera.y;
    }
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
