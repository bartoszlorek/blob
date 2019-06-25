import {fromEvent} from 'rxjs';
import PubSub from '@models/PubSub';

class Events extends PubSub {
  constructor() {
    super();

    const onResize$ = fromEvent(window, 'resize');
    onResize$.subscribe(() => this.publish('resize'));
  }

  onResize(handler) {
    this.subscribe('resize', handler);
  }

  onLoadLevel(handler) {
    this.subscribe('load_level', handler);
  }

  onUnloadLevel(handler) {
    this.subscribe('unload_level', handler);
  }
}

export default Events;
