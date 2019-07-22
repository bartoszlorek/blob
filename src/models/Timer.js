const pad = n => (n < 10 ? `0${n}` : n);

class Timer {
  constructor() {
    this.seconds = 0;
    this.playing = true;
  }

  update(deltaTime) {
    if (this.playing) {
      this.seconds += deltaTime;
    }
  }

  play() {
    this.playing = true;
  }

  stop() {
    this.playing = false;
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
