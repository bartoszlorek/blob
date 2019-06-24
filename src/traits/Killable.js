import Trait from '@traits/Trait';

class Killable extends Trait {
  constructor() {
    super('killable');
  }

  obstruct(entity, edge, other) {
    if (other.parent.name === 'bombs') {
      other.explosive.start(entity);
    }
  }
}

export default Killable;
