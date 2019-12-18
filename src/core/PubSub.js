import {arrayForEach, arrayFilter} from '@utils/array';

class PubSub {
  constructor() {
    this.events = {};
  }

  publish(name, data) {
    const handlers = this.events[name] || [];
    arrayForEach(handlers, handler => {
      const result = handler(data);

      if (result === false) {
        this.unsubscribe(name, handler);
      }
    });
  }

  subscribe(name, handler) {
    const handlers = this.events[name] || [];
    handlers.push(handler);
    this.events[name] = handlers;
  }

  unsubscribe(name, handler) {
    const handlers = this.events[name] || [];
    this.events[name] = arrayFilter(handlers, a => a !== handler);
  }
}

export default PubSub;
