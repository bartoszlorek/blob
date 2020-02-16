// @flow strict

const pad = n => (n < 10 ? `0${n}` : n);

class Timer {
  seconds: number;
  running: boolean;

  constructor() {
    this.seconds = 0;
    this.running = true;
  }

  update(deltaTime: number) {
    if (this.running) {
      this.seconds += deltaTime;
    }
  }

  start() {
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  reset() {
    this.seconds = 0;
  }

  toTime() {
    const minutes = Math.floor(this.seconds / 60);
    const seconds = Math.floor(this.seconds % 60);
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  toPreciseTime() {
    const minutes = Math.floor(this.seconds / 60);
    const seconds = Math.floor(this.seconds % 60);
    const milliseconds = Math.floor((this.seconds % 1) * 100);
    return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
  }
}

export default Timer;
