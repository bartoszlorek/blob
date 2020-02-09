// @flow strict

import {isTouchDevice} from '@utils/device';
import Button from '@core/gui/Button';
import Text from '@core/gui/Text';

export default function render() {
  const header = document.querySelector('.gui__header');

  const time = new Text('time');
  const score = new Text('score');

  time.value = 'time 00:00';
  score.value = 'score 0-0';

  if (header) {
    header.appendChild(time.node);
    header.appendChild(score.node);
  }

  if (isTouchDevice()) {
    // on-screen keyboard for touch devices
    const footer = document.querySelector('.gui__footer');

    if (footer) {
      const moveLeft = new Button('ArrowLeft');
      const moveRight = new Button('ArrowRight');
      const jump = new Button('Space');

      footer.appendChild(moveLeft.node);
      footer.appendChild(moveRight.node);
      footer.appendChild(jump.node);
    }
  }

  return {
    time,
    score,
  };
}
