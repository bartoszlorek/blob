class Keyboard {
  constructor(view) {
    this.states = new Map();
    this.events = new Map();
    this.listenTo(view);
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

  listenTo(view = window) {
    ['keydown', 'keyup'].forEach(type => {
      view.addEventListener(type, event => {
        this.handleEvent(event);
      });
    });
  }
}

export default Keyboard;
