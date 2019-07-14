// frame = [ms, fn]

class KeyFrames {
  constructor(name = '', frames = [], loop = false) {
    this.name = name;
    this.frames = frames;
    this.loop = loop;

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

  update(entity, deltaTime) {
    const milliseconds = deltaTime * 1000;
    const nextFrame = this.frames[this.nextIndex];

    if (nextFrame !== undefined) {
      if (this.timer >= nextFrame[0]) {
        nextFrame[1](entity, deltaTime);
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

export default KeyFrames;
