import {fromEvent, Subject, from} from 'rxjs';
import rxEmitter from '@utils/rxEmitter';

class Global {
  constructor(app, state, size = 32) {
    this.app = app;
    this.state = state;
    this.level = null;
    this.size = size;
    this.time = 1 / 60;

    // global events
    this.onStateChange$ = from(state);
    this.onPlayerDeath$ = rxEmitter(new Subject(), this);
    this.onLevelClear$ = rxEmitter(new Subject(), this);
    this.onGameOver$ = rxEmitter(new Subject(), this);
    this.onResize$ = fromEvent(window, 'resize');
    this.onResize$.subscribe(() => this.resize());
    this.resize();

    // global bindings
    let prevState = state;
    this.onStateChange$.subscribe(nextState => {
      if (prevState.lives > nextState.lives) {
        this.onPlayerDeath$.emit();
      }
      if (nextState.lives < 0) {
        this.onGameOver$.emit();
      }
      prevState = nextState;
    });

    this.onGameOver$.subscribe(() => {
      console.log('game over!');
    });

    console.log(this);
  }

  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.rootX = this.app.screen.width / 2;
    this.rootY = this.app.screen.height / 2;
  }

  load(level) {
    if (this.level !== null) {
      this.unload();
    }
    this.app.stage.addChild(level._container);
    this.level = level;
    level.global = this;
    level.onLoad(this);
  }

  unload() {
    this.app.stage.removeChild(this.level._container);
    this.level.onUnload(this);
    this.level.global = null;
    this.level = null;
  }

  gridToLocal(pos) {
    return pos * this.size;
  }

  localToGrid(pos) {
    return Math.round(pos / this.size) || 0;
  }

  globalToLocalX(x) {
    return x - this.rootX;
  }

  globalToLocalY(y) {
    return y - this.rootY;
  }

  globalToGridX(x) {
    return this.localToGrid(this.globalToLocalX(x));
  }

  globalToGridY(y) {
    return this.localToGrid(this.globalToLocalY(y));
  }
}

export default Global;
