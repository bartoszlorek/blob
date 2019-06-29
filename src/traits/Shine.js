import Trait from '@traits/Trait';

class Shine extends Trait {
  constructor() {
    super('shine');
    this.scale = 1;
    this.timer = 0;

    // parameters
    this.speed = 5;
  }

  update(entity, deltaTime) {
    const factor = (Math.sin(this.timer) + 1) / 2;
    entity.scale = factor < 0.25 ? this.scale * 0.8 : this.scale;
    this.timer += deltaTime * this.speed;
  }
}

export default Shine;
