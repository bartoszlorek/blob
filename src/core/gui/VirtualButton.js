// @flow strict

const initialDelay = 500;
const repeatsDelay = 80;

type KeyType = 'keydown' | 'keyup';

class VirtualButton {
  code: string;
  node: HTMLElement;

  constructor(code: string, node: HTMLElement) {
    this.code = code;
    this.node = node;

    let intervalId;
    let timeoutId;

    const clearTimer = () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };

    node.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault();
      clearTimer();

      timeoutId = setTimeout(() => {
        intervalId = setInterval(() => {
          this.handleEvent('keydown');
        }, repeatsDelay);

        this.handleEvent('keydown');
      }, initialDelay);

      this.handleEvent('keydown');
    });

    node.addEventListener('touchend', (e: TouchEvent) => {
      this.handleEvent('keyup');
      clearTimer();
    });
  }

  handleEvent(type: KeyType) {
    const event = new KeyboardEvent(type, {
      key: this.code,
      code: this.code,
    });

    window.dispatchEvent(event);

    if (type === 'keydown') {
      this.onKeydown();
    } else {
      this.onKeyup();
    }
  }

  onKeydown() {
    // fill in subclass
  }

  onKeyup() {
    // fill in subclass
  }
}

export default VirtualButton;
