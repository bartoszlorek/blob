import {isTouchDevice} from '@utils/device';
import Button from '@gui/Button';
import Text from '@gui/Text';

export default function render() {
  const header = document.querySelector('#gui-header');

  const time = new Text('time');
  const score = new Text('score');

  header.appendChild(time.node);
  header.appendChild(score.node);

  time.value = 'time 00:00';
  score.value = 'score 0-0';

  // virtual keyboard on mobile
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
