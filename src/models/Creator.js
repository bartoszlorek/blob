import {arrayForEach} from '@utils/array';

class Creator {
  constructor(global) {
    this.global = global;
    this.interaction = global.engine.renderer.plugins.interaction;
    this.points = [];

    global.engine.renderer.view.addEventListener('click', e => {
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

    const {ground, player} = this.global.level.layers;

    // const closest = ground.closest(current.x, current.y);
    // if (closest) {
    //   closest.forEach(child => child && (child.sprite.tint = 0x0000ff));
    // }

    // const shadow = ground.closestInDirection(current.x, current.y, 0, 1);
    // if (shadow) shadow.sprite.tint = 0x0000ff;

    player.closest(current.x, current.y);

    arrayForEach([...this.points, current], callback);
  }

  printJSON() {
    const array = this.points.map(point => [point.x, point.y]);
    console.log(JSON.stringify(array));
  }
}

export default Creator;
