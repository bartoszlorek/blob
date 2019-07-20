import {isTouchDevice} from '@utils/device';
import Button from '@gui/Button';
import Text from '@gui/Text';

export default function render() {
  const header = document.querySelector('#gui-header');

  const time = new Text('time');
  const score = new Text('score');
  time.value = 'time 00:00';
  score.value = 'score 0-0';

  header.appendChild(time.node);
  header.appendChild(score.node);

  if (isTouchDevice()) {
    // on-screen keyboard for touch devices
    const footer = document.querySelector('#gui-footer');

    const moveLeft = new Button('ArrowLeft');
    const moveRight = new Button('ArrowRight');
    const jump = new Button('Space');

    footer.appendChild(moveLeft.node);
    footer.appendChild(moveRight.node);
    footer.appendChild(jump.node);
  }

  return {
    time,
    score
  };
}
