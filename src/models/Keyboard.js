class Keyboard {
  constructor() {
    this.states = new Map();
    this.events = new Map();
    this.destroy = this.listen();
  }

  on(code, callback) {
    code.split(' ').forEach(e => {
      this.events.set(e, callback);
    });
  }

  handleEvent(event) {
    event.preventDefault();
    const {code} = event;

    if (!this.events.has(code)) {
      return;
    }
    const pressed = event.type === 'keydown';

    // prevents calling keyup before keydown
    if (!pressed && !this.states.get(code)) {
      return;
    }
    if (this.states.get(code) !== pressed) {
      this.states.set(code, pressed);
      this.events.get(code)(pressed);
    }
  }

  listen() {
    const handler = e => this.handleEvent(e);
    window.addEventListener('keydown', handler);
    window.addEventListener('keyup', handler);

    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('keyup', handler);
    };
  }
}

export default Keyboard;
