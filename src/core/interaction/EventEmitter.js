class EventEmitter {
  constructor() {
    this.registry = new Map();
  }

  emit(event, value) {
    const handlers = this.registry.get(event) || [];

    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      const result = handler(value);

      if (result === false) {
        this.off(event, handler);
      }
    }
  }

  on(event, handler) {
    const handlers = this.registry.get(event) || [];

    this.registry.set(event, handlers);
    handlers.push(handler);
  }

  off(event, handler) {
    const handlers = this.registry.get(event) || [];

    this.registry.set(event, handlers);
    arrayRemove(handlers, handler);
  }
}

export default EventEmitter;
