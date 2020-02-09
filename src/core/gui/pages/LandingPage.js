// @flow strict

import Page from '@core/gui/Page';
import Text from '@core/gui/Text';

type PropsType = {
  onClick: () => mixed,
};

class LandingPage extends Page<PropsType> {
  render() {
    const frag = this.createFragment();
    const logo = document.createElement('img');
    const start = new Text('start');

    logo.className = 'logo';
    logo.src = './assets/logo.png';
    logo.width = 1500;
    logo.height = 430;

    start.value = 'press start';
    start.onClick = this.props.onClick;

    frag.appendChild(logo);
    frag.appendChild(start.node);
    return frag;
  }
}

export default LandingPage;
