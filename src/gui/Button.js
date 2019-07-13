import VirtualButton from '@models/VirtualButton';

class Button extends VirtualButton {
  constructor(code) {
    super(code, document.createElement('div'));

    // style steering buttons
    this.node.className = `button button-${code}`;
  }

  onKeyup() {
    this.node.classList.remove('button--active');
  }

  onKeydown() {
    this.node.classList.add('button--active');
  }
}

export default Button;
