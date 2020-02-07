// @flow strict

import {arrayRemove} from '@utils/array';

type HandlerType = (value: mixed) => mixed;

class EventEmitter<EventType> {
  registry: Map<EventType, Array<HandlerType>>;

  constructor() {
    this.registry = new Map();
  }

  emit(event: EventType, value: mixed) {
    const handlers = this.registry.get(event) || [];

    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      const result = handler(value);

      if (result === false) {
        this.off(event, handler);
      }
    }
  }

  on(event: EventType, handler: HandlerType) {
    const handlers = this.registry.get(event) || [];

    this.registry.set(event, handlers);
    handlers.push(handler);
  }

  off(event: EventType, handler: HandlerType) {
    const handlers = this.registry.get(event) || [];

    this.registry.set(event, handlers);
    arrayRemove(handlers, handler);
  }
}

export default EventEmitter;
