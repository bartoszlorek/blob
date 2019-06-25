import Trait from '@traits/Trait';

class Collectable extends Trait {
  constructor(global, {}) {
    super('collectable');
    this.level = global.level;
  }

  update(entity, deltaTime) {
    const {head: player} = this.level.layers.player;
    if (player && player.intersection(entity)) {
      console.log('score!');
    }
  }
}

export default Collectable;
