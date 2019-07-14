const eventTypes = ['keydown', 'keyup'];

class Keyboard {
  constructor() {
    this.states = new Map();
    this.events = new Map();
    this.listen();
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
    if (this.states.get(code) !== pressed) {
      this.states.set(code, pressed);
      this.events.get(code)(pressed);
    }
  }

  listen() {
    this._handler = this.handleEvent.bind(this);

    eventTypes.forEach(type => {
      window.addEventListener(type, this._handler);
    });
  }

  destroy() {
    eventTypes.forEach(type => {
      window.removeEventListener(type, this._handler);
    });
  }
}

export default Keyboard;
