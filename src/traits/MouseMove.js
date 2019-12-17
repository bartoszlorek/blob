import {baseSize} from '@app/consts';
import Trait from '@traits/Trait';

class MouseMove extends Trait {
  constructor(global) {
    super('mouse_move');

    this.active = false;
    this.speed = 5;
    this.x = 0;
    this.y = 0;

    const {view} = global.engine.renderer;
    const handleMouseDown = () => (this.active = true);
    const handleMouseUp = () => (this.active = false);
    const handleMouseMove = event => {
      this.x = global.globalToLocalX(event.offsetX);
      this.y = global.globalToLocalY(event.offsetY);
      // this.printTilesPosition();
    };

    view.addEventListener('mousedown', handleMouseDown);
    view.addEventListener('mouseup', handleMouseUp);
    view.addEventListener('mousemove', handleMouseMove);
  }

  update(body) {
    if (!this.active) {
      return;
    }
    const halfSize = baseSize / 2;
    const desiredX = this.x - halfSize - body.min[0];
    const desiredY = this.y - halfSize - body.min[1];

    body.velocity[0] += desiredX * this.speed - body.velocity[0];
    body.velocity[1] += desiredY * this.speed - body.velocity[1];
  }

  printLocalPosition() {
    console.log(this.x, this.y);
  }

  printTilesPosition() {
    const x = Math.round(this.x / baseSize);
    const y = Math.round(this.y / baseSize);
    console.log(x, y);
  }
}

export default MouseMove;
