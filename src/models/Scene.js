import {Container} from 'pixi.js';
import Background from '@models/Background';
import Group from '@models/Group';
import World from '@physics/World';

class Scene {
  constructor(name, global) {
    this.name = name;
    this.global = global;
    this.children = {};
    this.physics = new World();

    this._background = new Background();
    this._foreground = new Container();

    this.graphics = new Container();
    this.graphics.addChild(this._background.sprite);
    this.graphics.addChild(this._foreground);

    this.resize();
  }

  add(name, child) {
    this.children[name] = child;

    if (child.isTilemap) {
      child.tiles.forEach(tile => {
        this._foreground.addChild(tile.sprite);
      });
    } else {
      this._foreground.addChild(child);
    }
  }

  remove(name) {
    const child = this.children[name];

    if (!child) {
      return;
    }
    if (child.isTilemap) {
      child.tiles.forEach(tile => {
        this._foreground.removeChild(tile.sprite);
        tile.remove();
      });
    } else {
      this._foreground.removeChild(child);
    }

    this.children[name] = null;
  }

  create() {
    // in subclass
  }

  update(deltaTime) {
    // in subclass
  }

  resize() {
    this._foreground.x = this.global.rootX;
    this._foreground.y = this.global.rootY;
    this._background.resize();
  }
}

export default Scene;
