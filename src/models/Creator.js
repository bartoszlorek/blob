import {Graphics} from 'pixi.js';

class Creator {
  constructor(global, level) {
    this.global = global;
    this.level = level;
    this.interaction = global.app.renderer.plugins.interaction;

    this.pointer = new Graphics();
    this.pointer.lineStyle(1, 0x000000);
    this.pointer.drawRect(0, 0, global.size, global.size);

    global.app.stage.addChild(this.pointer);
    global.app.renderer.view.addEventListener('click', e => {
      let x = global.globalToGridX(e.offsetX),
        y = global.globalToGridY(e.offsetY);
      console.log(x, y);
    });
  }

  render(global) {
    let pos = this.interaction.mouse.global,
      x = global.globalToGridX(pos.x),
      y = global.globalToGridY(pos.y);

    this.pointer.position.set(
      global.rootX + global.gridToLocal(x) - global.size / 2,
      global.rootY + global.gridToLocal(y) - global.size / 2
    );
  }
}

export default Creator;
