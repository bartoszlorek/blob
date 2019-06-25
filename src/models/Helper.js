import {Graphics} from 'pixi.js';
import {arrayForEach} from '@utils/array';

class Helper {
  constructor(global) {
    this.global = global;
    this.graphics = null;
    this.level = null;

    this.enabled = true;
    this.pending = false;
    this.tasks = [];

    // parameters
    this.pointSize = 4;
    this.lineWidth = 2;
    this.color = 0xffffff;

    // events
    global.events.onLoadLevel(() => {
      this.graphics = new Graphics();
      this.level = global.level;
      this.level.helpers.addChild(this.graphics);
    });

    global.events.onUnloadLevel(() => {
      this.level = null;
    });
  }

  renderPoint(vector) {
    this._requestRender();
    this.tasks.push({
      type: 'point',
      x: vector.x - this.pointSize / 2,
      y: vector.y - this.pointSize / 2,
      width: this.pointSize,
      height: this.pointSize
    });
  }

  renderBox(vector, size) {
    const boxSize = size || this.global.size;
    this._requestRender();
    this.tasks.push({
      type: 'box',
      x: vector.x - boxSize / 2,
      y: vector.y - boxSize / 2,
      width: boxSize,
      height: boxSize
    });
  }

  renderBounds(bounds) {
    this._requestRender();
    this.tasks.push({
      type: 'bounds',
      x: bounds.left,
      y: bounds.top,
      width: Math.abs(bounds.right - bounds.left),
      height: Math.abs(bounds.bottom - bounds.top)
    });
  }

  _requestRender() {
    if (!this.pending && this.enabled) {
      setImmediate(() => this._render());
      this.pending = true;
    }
  }

  _render() {
    if (!this.level) {
      return;
    }
    this.graphics.clear();
    arrayForEach(this.tasks, task => {
      if (task.type === 'point') {
        this.graphics.beginFill(this.color);
      } else {
        this.graphics.lineStyle(2, this.color);
      }

      this.graphics.drawRect(
        this.global.rootX + task.x,
        this.global.rootY + task.y,
        task.width,
        task.height
      );
      this.graphics.endFill();
      this.graphics.lineStyle(0);
    });

    this.tasks = [];
    this.pending = false;
  }
}

export default Helper;
