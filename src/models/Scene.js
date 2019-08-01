import {Container} from 'pixi.js';
import Background from '@models/Background';
import Group from '@models/Group';
import World from '@physics/World';

class Scene {
  constructor(name, global, data) {
    this.name = name;
    this.data = data;

    this.global = global;
    this.physics = new World();

    this._background = new Background();
    this._foreground = new Container();

    this.graphics = new Container();
    this.graphics.addChild(this._background.sprite);
    this.graphics.addChild(this._foreground);

    this.resize();
  }

  addTilemap(tilemap) {
    tilemap.forEach(tile => {
      this._foreground.addChild(tile.sprite);
    });
  }

  addBody(body) {
    this._foreground.addChild(body.sprite);
  }

  create() {
    // call in subclass
  }

  update(deltaTime) {
    // call in subclass
  }

  resize() {
    this._foreground.x = this.global.rootX;
    this._foreground.y = this.global.rootY;
    this._background.resize();
  }
}

export default Scene;
