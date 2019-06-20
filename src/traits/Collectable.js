import Trait from '@traits/Trait';

class Collectable extends Trait {
  constructor() {
    super('collectable');
  }

  update(entity, deltaTime) {
    let player = entity.ownerLevel.layers.player.head;
    if (player !== undefined && player.intersection(entity)) {
      console.log('score!');
    }
  }
}

export default Collectable;
