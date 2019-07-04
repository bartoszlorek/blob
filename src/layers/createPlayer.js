import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';
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
  const {physics} = global.level;

  const entity = new Entity(
    new Sprite(texture),
    gridToLocal(player[0]),
    gridToLocal(player[1])
  );

  entity.addTrait(new Physics({physics}));
  entity.addTrait(new Move({physics}));
  entity.addTrait(new Jump({physics}));
  entity.addTrait(new Killable());

  // todo: remove listeners on level unload
  const input = new Keyboard();
  input.on('ArrowRight', pressed => {
    entity.move[pressed ? 'forward' : 'backward']();
  });

  input.on('ArrowLeft', pressed => {
    entity.move[pressed ? 'backward' : 'forward']();
  });

  input.on('Space', pressed => {
    entity.jump[pressed ? 'start' : 'cancel']();
  });

  layer.addChild(entity);
  return layer;
}

export default createPlayer;
