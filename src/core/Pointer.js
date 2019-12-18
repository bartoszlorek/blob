import {Graphics} from 'pixi.js';
import {baseSize} from '@app/consts';

class Pointer {
  constructor(global) {
    this.view = global.engine.renderer.view;

    // pixijs
    this.marker = new Graphics();
    this.marker.lineStyle(2, 0xffffff);
    this.marker.drawRect(0, 0, baseSize, baseSize);

    // events
    const handleClick = e => {
      const x = global.globalToGridX(e.offsetX);
      const y = global.globalToGridY(e.offsetY);
      this.onClick(x, y);
    };

    const handleMousemove = e => {
      const x = global.globalToGridX(e.offsetX) * baseSize;
      const y = global.globalToGridY(e.offsetY) * baseSize;
      this.marker.position.set(x, y);
    };

    this.view.addEventListener('click', handleClick);
    this.view.addEventListener('mousemove', handleMousemove);

    this.destroy = () => {
      this.view.removeEventListener('click', handleClick);
      this.view.removeEventListener('mousemove', handleMousemove);
    };
  }

  onClick(x, y) {
    // replace on instance
  }
}

export default Pointer;
