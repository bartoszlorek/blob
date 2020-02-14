// @flow strict

import {
  clearFrameRequest,
  setFrameTimeout,
  setFrameInterval,
  type RequestType,
} from '@utils/raf';

const initialDelay = 500;
const repeatsDelay = 80;

type KeyType = 'keydown' | 'keyup';

class VirtualButton {
  code: string;
  node: HTMLElement;

  constructor(code: string, node: HTMLElement) {
    this.code = code;
    this.node = node;

    let intervalRequest: RequestType;
    let timeoutRequest: RequestType;

    const clearTimer = () => {
      clearFrameRequest(intervalRequest);
      clearFrameRequest(timeoutRequest);
    };

    node.addEventListener('touchstart', (event: TouchEvent) => {
      event.preventDefault();
      clearTimer();

      timeoutRequest = setFrameTimeout(() => {
        intervalRequest = setFrameInterval(() => {
          this.handleEvent('keydown');
        }, repeatsDelay);

        this.handleEvent('keydown');
      }, initialDelay);

      this.handleEvent('keydown');
    });

    node.addEventListener('touchend', () => {
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
