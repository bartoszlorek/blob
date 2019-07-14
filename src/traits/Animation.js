import KeyFrames from '@models/KeyFrames';
import Trait from '@traits/Trait';

class Animation extends Trait {
  constructor() {
    super('animation');
    this.keyframes = [];
  }

  add(name, frames, loop) {
    const keys = new KeyFrames(name, frames, loop);
    this.keyframes.push(keys);
    this[name] = keys;
    return this;
  }

  update(entity, deltaTime) {
    let index = this.keyframes.length;

    while (0 < index--) {
      if (this.keyframes[index].playing) {
        this.keyframes[index].update(entity, deltaTime);
      }
    }
  }
}

export default Animation;
