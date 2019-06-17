const PRESSED = 1;
const RELEASED = 0;

class Keyboard {
  constructor(view) {
    this.states = new Map();
    this.events = new Map();
    this.listenTo(view);
  }

  on(code, callback) {
    this.events.set(code, callback);
  }

  handleEvent(event) {
    event.preventDefault();
    const {code} = event;

    if (!this.events.has(code)) {
      return;
    }
    const keyState = event.type === 'keydown' ? PRESSED : RELEASED;
    if (this.states.get(code) !== keyState) {
      this.states.set(code, keyState);
      this.events.get(code)(keyState);
    }
  }

  listenTo(view = window) {
    ['keydown', 'keyup'].forEach(type => {
      view.addEventListener(type, event => {
        this.handleEvent(event);
      });
    });
  }
}

export default Keyboard;
