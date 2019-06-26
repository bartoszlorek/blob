import {objectForEach} from '@utils/object';
import KeyFrames from '@models/KeyFrames';
import Trait from '@traits/Trait';

class Animation extends Trait {
  constructor(global, {}) {
    super('animation');
    this.keyframes = {};
  }

  add(name, frames = [], loop = false) {
    this.keyframes[name] = new KeyFrames(frames, loop);
    return this;
  }

  play(name, frames, loop) {
    if (frames !== undefined) {
      this.add(name, frames, loop);
    }
    if (this.keyframes[name]) {
      this.keyframes[name].play();
    }
    return this;
  }

  update(entity, deltaTime) {
    objectForEach(this.keyframes, keyframe => {
      if (keyframe.playing) {
        keyframe.update(deltaTime);
      }
    });
  }
}

export default Animation;
