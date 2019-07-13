import {isTouchDevice} from '@utils/device';
import Button from '@gui/Button';

export default function render() {
  if (!isTouchDevice()) {
    return false;
  }
  const footer = document.querySelector('#gui-footer');

  const moveLeft = new Button('ArrowLeft');
  const moveRight = new Button('ArrowRight');
  const jump = new Button('Space');

  footer.appendChild(moveLeft.elem);
  footer.appendChild(moveRight.elem);
  footer.appendChild(jump.elem);
}
