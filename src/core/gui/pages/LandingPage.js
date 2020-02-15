// @flow strict

import Page from '@core/gui/Page';
import Text from '@core/gui/Text';

type PropsType = {|
  onStart: () => mixed,
|};

class LandingPage extends Page<PropsType> {
  render({onStart}: PropsType) {
    const frag = this.createFragment();
    const logo = document.createElement('img');
    const start = new Text('start');

    logo.className = 'logo';
    logo.src = './assets/logo.png';
    logo.width = 732;
    logo.height = 184;

    start.value = 'start game';
    start.onClick = handleStart;

    window.addEventListener('keydown', handleStart);

    function handleStart() {
      window.removeEventListener('keydown', handleStart);
      onStart();
    }

    frag.appendChild(logo);
    frag.appendChild(start.node);
    return frag;
  }
}

export default LandingPage;
