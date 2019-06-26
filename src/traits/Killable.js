import Trait from '@traits/Trait';

class Killable extends Trait {
  constructor(global, {}) {
    super('killable');
  }

  obstruct(entity, edge, other) {
    if (other.parent.name === 'mines') {
      other.explosive.ignite();
    }
  }
}

export default Killable;
