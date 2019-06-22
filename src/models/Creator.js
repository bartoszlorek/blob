import {arrayForEach} from '@utils/array';

class Creator {
  constructor(global) {
    this.global = global;
    this.interaction = global.app.renderer.plugins.interaction;
    this.points = [];

    global.app.renderer.view.addEventListener('click', e => {
      const x = global.globalToGridX(e.offsetX);
      const y = global.globalToGridY(e.offsetY);
      this.points.push({x, y});
      this.printJSON();
    });
  }

  forEach(callback) {
    const {x, y} = this.interaction.mouse.global;
    const current = {
      x: this.global.globalToGridX(x),
      y: this.global.globalToGridY(y)
    };

    arrayForEach([...this.points, current], callback);
  }

  printJSON() {
    const array = this.points.map(point => [point.x, point.y]);
    console.log(JSON.stringify(array));
  }
}

export default Creator;
