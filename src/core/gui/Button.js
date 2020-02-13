// @flow strict

import VirtualButton from './VirtualButton';

class Button extends VirtualButton {
  code: string;
  codeName: string;

  constructor(code: string) {
    if (!code) {
      throw 'Button requires code argument';
    }
    super(code, document.createElement('div'));

    this.codeName = `button-${code}`;
    this.node.className = `button ${this.codeName}`;
  }

  onKeyup() {
    this.node.classList.remove(`${this.codeName}--active`);
  }

  onKeydown() {
    this.node.classList.add(`${this.codeName}--active`);
  }
}

export default Button;
