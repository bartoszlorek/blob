import Trait from '@traits/Trait';

class Blink extends Trait {
  constructor({freq = 0.15}) {
    super('blink');
    this.freq = freq;
    this.time = 0;
  }

  update(entity, deltaTime) {
    if (this.time > this.freq) {
      entity.sprite.visible = !entity.sprite.visible;
      this.time = 0;
    }
    this.time += deltaTime;
  }
}

export default Blink;
