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

  onStart(handler) {
    this.subscribe('start', handler);
  }

  onMountLevel(handler) {
    this.subscribe('mount_level', handler);
  }

  onUnmountLevel(handler) {
    this.subscribe('unmount_level', handler);
  }

  onPlayerDead(handler) {
    this.subscribe('player_dead', handler);
  }

  onScore(handler) {
    this.subscribe('score', handler);
  }
}

export default Events;
