import Trait from '@traits/Trait';

class Shine extends Trait {
  constructor(size) {
    super('shine');
    this.size = size;
    this.speed = 5;
    this.timer = 0;
  }

  update(entity, deltaTime) {
    const factor = (Math.sin(this.timer) + 1) / 2;
    entity.size = factor < 0.25 ? this.size * 0.8 : this.size;
    this.timer += deltaTime * this.speed;
  }
}

export default Shine;
