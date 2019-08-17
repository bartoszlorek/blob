import Animation from '@models/Animation';

class Animator {
  constructor() {
    this.animations = [];
  }

  add(name, props) {
    const animation = new Animation(name, props);
    this.animations.push(animation);
    this[name] = animation;
  }

  update(keyframes, deltaTime) {
    let index = this.animations.length;

    while (index > 0) {
      const animation = this.animations[--index];

      if (animation.playing) {
        animation.update(keyframes[animation.name], deltaTime);
      }
    }
  }
}

export default Animator;
