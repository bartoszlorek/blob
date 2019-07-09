import Trait from '@traits/Trait';

class Collectable extends Trait {
  constructor() {
    super('collectable');
  }

  collide(entity, other) {
    if (other.parent.name === 'player') {
      console.log('score!');
    }
  }
}

export default Collectable;
