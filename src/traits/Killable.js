import Trait from '@traits/Trait';

class Killable extends Trait {
  constructor() {
    super('killable');
  }

  obstruct(entity, edge, match) {
    if (match.parent.name === 'bombs') {
      match.explosive.start(entity);
    }
  }
}

export default Killable;
