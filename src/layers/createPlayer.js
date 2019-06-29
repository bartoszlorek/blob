import {Sprite} from 'pixi.js';

import Keyboard from '@models/Keyboard';
import Layer from '@models/Layer';
import Entity from '@models/Entity';

import Physics from '@traits/Physics';
import Killable from '@traits/Killable';
import Move from '@traits/Move';
import Jump from '@traits/Jump';

function createPlayer(global, {player}) {
  const layer = new Layer('player');
  const {texture} = global.assets['player'];

  const entity = new Entity(
    new Sprite(texture),
    global.gridToLocal(player[0]),
    global.gridToLocal(player[1])
  );

  entity.addTrait(new Physics(global, {}));
  entity.addTrait(new Killable(global, {}));
  entity.addTrait(new Move(global, {}));
  entity.addTrait(new Jump(global, {}));

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

  layer.append(entity);
  return layer;
}

export default createPlayer;
