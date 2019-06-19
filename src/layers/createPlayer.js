import Keyboard from '@models/Keyboard';
import Layer from '@models/Layer';
import Entity from '@models/Entity';

import Physics from '@traits/Physics';
import Killable from '@traits/Killable';
import Move from '@traits/Move';
import Jump from '@traits/Jump';

const PLAYER_COLOR = 0x00fd83;

function createPlayer(data, global, level) {
  const layer = new Layer('player', PLAYER_COLOR);
  const entity = new Entity(0, -250, global.size);
  layer.append(entity);

  entity.addTrait(new Physics());
  entity.addTrait(new Killable());
  entity.addTrait(new Move(level.physics));
  entity.addTrait(new Jump());

  const input = new Keyboard();
  input.on('ArrowRight', pressed => {
    entity.move.direction += pressed ? 1 : -1;
  });

  input.on('ArrowLeft', pressed => {
    entity.move.direction += pressed ? -1 : 1;
  });

  input.on('Space', pressed => {
    if (pressed) {
      entity.jump.start();
    } else {
      entity.jump.cancel();
    }
  });

  return layer;
}

export default createPlayer;
