// @flow strict

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

  return {
    time,
    score,
  };
}
