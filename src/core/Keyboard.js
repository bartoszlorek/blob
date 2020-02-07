// @flow strict

type KeyCode = $PropertyType<KeyboardEvent, 'key'>;

class Keyboard {
  states: Map<KeyCode, boolean>;
  events: Map<KeyCode, (pressed: boolean) => mixed>;
  destroy: () => mixed;

  constructor() {
    this.states = new Map();
    this.events = new Map();
    this.destroy = this.listen();
  }

  on(code: KeyCode, callback: (pressed: boolean) => mixed) {
    code.split(' ').forEach(key => {
      this.events.set(key, callback);
    });
  }

  handleEvent(event: KeyboardEvent) {
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

      const callback = this.events.get(code);
      if (callback) callback(pressed);
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
