const initialDelay = 500;
const repeatsDelay = 80;

class VirtualButton {
  constructor(code, node) {
    this.code = code;
    this.node = node;

    let timer;

    node.addEventListener('touchstart', e => {
      e.preventDefault();

      timer = setTimeout(() => {
        timer = setInterval(() => {
          this.handleEvent('keydown');
        }, repeatsDelay);

        this.handleEvent('keydown');
      }, initialDelay);

      this.handleEvent('keydown');
    });

    node.addEventListener('touchend', e => {
      clearInterval(timer);
      setTimeout(timer);

      this.handleEvent('keyup');
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
