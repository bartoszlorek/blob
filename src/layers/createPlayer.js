import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';

import Keyboard from '@models/Keyboard';
import ActiveLayer from '@models/ActiveLayer';
import Entity from '@models/Entity';

import Physics from '@traits/Physics';
import Killable from '@traits/Killable';
import Animation from '@traits/Animation';
import Move from '@traits/Move';
import Jump from '@traits/Jump';

const deadFrames = [
  [100, entity => (entity.visible = false)],
  [200, entity => (entity.visible = true)],
  [300, entity => (entity.visible = false)],
  [400, entity => (entity.visible = true)],
  [500, entity => (entity.visible = false)],
  [500, entity => entity.remove()]
];

function createPlayer(global, {player}) {
  const {texture} = global.assets['player'];
  const {physics} = global.level;
  const layer = new ActiveLayer('player');

  const child = new Entity(
    new Sprite(texture),
    gridToLocal(player[0]),
    gridToLocal(player[1])
  );

  child.addTrait(new Physics({physics}));
  child.addTrait(new Move({physics}));
  child.addTrait(new Jump({physics}));
  child.addTrait(new Killable());
  child.addTrait(new Animation());
  child.animation.add('dead', deadFrames);

  // todo: remove listeners on level unload
  const input = new Keyboard();
  input.on('ArrowRight KeyD', pressed => {
    child.move[pressed ? 'forward' : 'backward']();
  });

  input.on('ArrowLeft KeyA', pressed => {
    child.move[pressed ? 'backward' : 'forward']();
  });

  input.on('Space', pressed => {
    child.jump[pressed ? 'start' : 'cancel']();
  });

  layer.addChild(child);
  return layer;
}

export default createPlayer;
