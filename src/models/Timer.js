const pad = n => (n < 10 ? `0${n}` : n);

class Timer {
  constructor() {
    this.seconds = 0;
  }

  update(deltaTime) {
    this.seconds += deltaTime;
  }

  toTime() {
    const minutes = Math.floor(this.seconds / 60);
    const seconds = Math.floor(this.seconds % 60);
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}

export default Timer;
