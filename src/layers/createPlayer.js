import Vector from '@utils/Vector';

import Keyboard from '@models/Keyboard';
import Layer from '@models/Layer';
import Entity from '@models/Entity';
import Raycast from '@models/Raycast';

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
  entity.addTrait(new Move());
  entity.addTrait(new Jump());

  const input = new Keyboard();
  input.on('ArrowRight', state => {
    entity.move.dir += state ? 1 : -1;
  });

  input.on('ArrowLeft', state => {
    entity.move.dir += state ? -1 : 1;
  });

  input.on('Space', state => {
    if (state) {
      entity.jump.start();
    } else {
      entity.jump.cancel();
    }
  });

  input.on('Enter', state => {
    if (state) {
      const raycast = new Raycast(level, ['ground']);
      const top = raycast.scan(entity.pos, new Vector(0, -1));
      const right = raycast.scan(entity.pos, new Vector(1, 0));
      const bottom = raycast.scan(entity.pos, new Vector(0, 1));
      const left = raycast.scan(entity.pos, new Vector(-1, 0));

      console.log({top, right, bottom, left});
    }
  });

  return layer;
}

export default createPlayer;
