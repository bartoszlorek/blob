import Trait from '@traits/Trait';

class Collectable extends Trait {
  constructor({global}) {
    super('collectable');
    this.global = global;
  }

  collide(entity, other) {
    if (other.parent.name === 'player') {
      entity.remove();
      this.global.events.publish('score');
    }
  }
}

export default Collectable;
