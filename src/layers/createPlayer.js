import Keyboard from '@models/Keyboard';
import Layer from '@models/Layer';
import Entity from '@models/Entity';

import Physics from '@traits/Physics';
import Killable from '@traits/Killable';
import Haptic from '@traits/Haptic';
import Move from '@traits/Move';
import Jump from '@traits/Jump';

function createPlayer(data, global, level) {
  const layer = new Layer('player', 0x2de2e6);
  const entity = new Entity(0, -250, global.size);
  layer.append(entity);

  entity.addTrait(new Physics());
  entity.addTrait(new Killable());
  entity.addTrait(new Move(level.physics));
  entity.addTrait(new Jump(level.physics));
  entity.addTrait(new Haptic('ground'));

  // todo: remove listeners on level unload
  const input = new Keyboard();
  input.on('ArrowRight', pressed => {
    entity.move[pressed ? 'forward' : 'stop']();
  });

  input.on('ArrowLeft', pressed => {
    entity.move[pressed ? 'backward' : 'stop']();
  });

  input.on('Space', pressed => {
    entity.jump[pressed ? 'start' : 'cancel']();
  });

  return layer;
}

export default createPlayer;
