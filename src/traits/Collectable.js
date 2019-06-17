import Trait from '@traits/Trait';
import {gainScore} from '@state/actions';

class Collectable extends Trait {
  constructor() {
    super('collectable');
  }

  update(entity, deltaTime) {
    let player = entity.ownerLevel.layers.player.head;
    if (player !== undefined && player.intersection(entity)) {
      entity.ownerGlobal.state.dispatch(gainScore(100));
    }
  }
}

export default Collectable;
