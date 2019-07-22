import {utils} from 'pixi.js';
import {localToGrid} from '@app/consts';
import Events from '@models/Events';

class Global {
  constructor({engine, assets}) {
    this.engine = engine;
    this.assets = assets;
    this.scenes = [];

    // parameters
    this.time = 1 / 60;

    this.events = new Events();
    this.events.onResize(() => this.resize());
    this.resize();
  }

  tick(callback) {
    this.engine.ticker.add(deltaFrame => {
      let index = this.scenes.length;

      const deltaTime = deltaFrame * this.time;

      while (index > 0) {
        this.scenes[--index].update(deltaTime);
      }
      if (callback) {
        callback(deltaTime);
      }
    });
  }

  resize() {
    const {innerWidth, innerHeight} = window;
    this.engine.renderer.resize(innerWidth, innerHeight);
    this.rootX = Math.round(innerWidth / 2);
    this.rootY = Math.round(innerHeight / 2);
  }

  addScene(scene) {
    this.scenes.push(scene);
    this.engine.stage.addChild(scene.elements);
  }

  removeScene(index) {
    const scene = this.scenes[index];

    if (scene) {
      this.engine.stage.removeChild(scene.elements);
      utils.removeItems(this.scenes, index, 1);
      scene.destroy();
      return true;
    }
  }

  replaceScene(index, scene) {
    if (this.removeScene(index)) {
      this.addScene(scene);
    }
  }

  localToGlobalX(x) {
    return x + this.rootX + this.level.offsetX;
  }

  localToGlobalY(y) {
    return y + this.rootY + this.level.offsetY;
  }

  globalToLocalX(x) {
    return x - this.rootX - this.level.offsetX;
  }

  globalToLocalY(y) {
    return y - this.rootY - this.level.offsetY;
  }

  globalToGridX(x) {
    return localToGrid(this.globalToLocalX(x));
  }

  globalToGridY(y) {
    return localToGrid(this.globalToLocalY(y));
  }
}

export default Global;
