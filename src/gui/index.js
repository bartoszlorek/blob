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

  footer.appendChild(moveLeft.node);
  footer.appendChild(moveRight.node);
  footer.appendChild(jump.node);
}
