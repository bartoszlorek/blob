import {isTouchDevice} from '@utils/device';
import Button from '@gui/Button';
import Text from '@gui/Text';

export default function render() {
  const landing = document.querySelector('.landing');
  const header = document.querySelector('.gui__header');

  const start = new Text('start');
  const time = new Text('time');
  const score = new Text('score');

  start.value = 'press start';
  time.value = 'time 00:00';
  score.value = 'score 0-0';

  landing.appendChild(start.node);
  header.appendChild(time.node);
  header.appendChild(score.node);

  if (isTouchDevice()) {
    // on-screen keyboard for touch devices
    const footer = document.querySelector('.gui__footer');

    const moveLeft = new Button('ArrowLeft');
    const moveRight = new Button('ArrowRight');
    const jump = new Button('Space');

    footer.appendChild(moveLeft.node);
    footer.appendChild(moveRight.node);
    footer.appendChild(jump.node);
  }

  return {
    landing,
    start,
    time,
    score
  };
}
