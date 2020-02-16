// @flow strict

import {isTouchDevice} from '@utils/device';
import UserInterface from '@core/gui/UserInterface';
import Button from '@core/gui/Button';

class Footer extends UserInterface {
  constructor(rootSelector: string) {
    super(document.querySelector(rootSelector));
  }

  render() {
    if (!isTouchDevice()) {
      return;
    }
    const moveLeft = new Button('ArrowLeft');
    const moveRight = new Button('ArrowRight');
    const jump = new Button('Space');

    this.setup(moveLeft.node, moveRight.node, jump.node);
  }
}

export default Footer;
