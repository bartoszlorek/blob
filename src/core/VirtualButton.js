const initialDelay = 500;
const repeatsDelay = 80;

class VirtualButton {
  constructor(code, node) {
    this.code = code;
    this.node = node;

    let timer;

    const clearTimer = () => {
      clearInterval(timer);
      clearTimeout(timer);
    };

    node.addEventListener('touchstart', e => {
      e.preventDefault();
      clearTimer();

      timer = setTimeout(() => {
        timer = setInterval(() => {
          this.handleEvent('keydown');
        }, repeatsDelay);

        this.handleEvent('keydown');
      }, initialDelay);

      this.handleEvent('keydown');
    });

    node.addEventListener('touchend', e => {
      this.handleEvent('keyup');
      clearTimer();
    });
  }

  handleEvent(type) {
    const event = new KeyboardEvent(type, {
      key: this.code,
      code: this.code
    });

    window.dispatchEvent(event);

    if (type === 'keydown') {
      this.onKeydown();
    } else {
      this.onKeyup();
    }
  }

  onKeydown() {}

  onKeyup() {}
}

export default VirtualButton;
