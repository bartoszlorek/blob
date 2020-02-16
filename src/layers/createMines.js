// @flow strict

import {randomInt} from '@utils/math';
import Body from '@core/physics/Body';
import Group from '@core/physics/Group';
import Explosive from '@traits/Explosive';
import AnimatedSprite from '@core/AnimatedSprite';

import type {KeyframesType} from '@core/Animation';
import type {LayerProps} from '@layers';

function createMines({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['mines'];

  if (layer.type === 'tileLayer') {
    throw Error('wrong type of layer');
  }

  let mines = new Group();

  layer.sprites.forEach(sprite => {
    const {id, position} = sprite;

    const mine = new Body(
      new AnimatedSprite(spriteset.spritesheet.getById(id)),
      [position[0] * spriteset.tilesize, position[1] * spriteset.tilesize],
      spriteset.tilesize
    );

    const keyframes: KeyframesType = {
      reflection: {
        frame: randomInt(-10, 0),
        delay: 15,
        firstId: id,
        lastId: id + 7,
      },
    };

    mine.sprite.animation.keyframes = keyframes;
    mine.sprite.animation.play('reflection');

    if (mines) {
      mine.addTrait(new Explosive(global));
      mines.add(mine);
    }
  });

  function cleanup() {
    mines = null;
  }

  return [mines, cleanup];
}

export default createMines;
