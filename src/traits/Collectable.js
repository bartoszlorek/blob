import Trait from '@traits/Trait';

class Collectable extends Trait {
  constructor({level}) {
    super('collectable');
    this.level = level;
  }

  update(entity, deltaTime) {
    const {player} = this.level;
    if (player && player.intersection(entity)) {
      console.log('score!');
    }
  }
}

export default Collectable;
