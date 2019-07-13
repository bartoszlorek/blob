const initialDelay = 500;
const repeatsDelay = 80;

class Button {
  constructor(code) {
    this.code = code;
    this.elem = document.createElement('div');
    this.elem.className = `button button-${code}`;

    let timer;

    this.elem.addEventListener('touchstart', e => {
      e.preventDefault();

      timer = setTimeout(() => {
        timer = setInterval(() => {
          this.handleEvent('keydown');
        }, repeatsDelay);

        this.handleEvent('keydown');
      }, initialDelay);

      this.handleEvent('keydown');
    });

    this.elem.addEventListener('touchend', e => {
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
  }
}

export default Button;
