class Animation {
  constructor(name, props = []) {
    this.name = name;
    this.props = props;
    this.loop = true;

    // parameters
    this.playing = false;
    this.nextIndex = 0;
    this.timer = 0;
  }

  reload() {
    this.nextIndex = 0;
    this.timer = 0;
  }

  play() {
    this.playing = true;
  }

  pause() {
    this.playing = false;
  }

  stop() {
    this.reload();
    this.pause();
  }

  update(keyframes, deltaTime) {
    const milliseconds = deltaTime * 1000;
    const nextFrame = keyframes[this.nextIndex];

    if (nextFrame !== undefined) {
      if (this.timer >= nextFrame[0]) {
        nextFrame[1].apply(null, this.props);
        this.nextIndex += 1;
      }
      this.timer += milliseconds;
    } else if (this.loop) {
      this.reload();
    } else {
      this.stop();
    }
  }
}

export default Animation;
