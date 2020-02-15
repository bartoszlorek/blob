// @flow strict

import {randomInt} from '@utils/math';
import Body from '@core/physics/Body';
import Group from '@core/physics/Group';
import Collectible from '@traits/Collectible';
import AnimatedSprite from '@core/AnimatedSprite';

import type {KeyframesType} from '@core/Animation';
import type {LayerProps} from '@layers';

const glowDistance = 10;

function createGems({global, spriteset}: LayerProps) {
  const layer = spriteset.layers['gems'];

  if (layer.type === 'tileLayer') {
    throw Error('wrong type of layer');
  }

  let gems = new Group();

  layer.sprites.forEach(sprite => {
    const {id, position} = sprite;

    const gem = new Body(
      new AnimatedSprite(spriteset.spritesheet.getById(id)),
      [position[0] * spriteset.tilesize, position[1] * spriteset.tilesize],
      spriteset.tilesize
    );

    const keyframes: KeyframesType = {
      shine: {
        frame: 0,
        delay: randomInt(5, 10),
        firstId: id,
        lastId: id + 5,
      },
    };

    gem.sprite.animation.keyframes = keyframes;
    gem.sprite.animation.play('shine');

    if (gems) {
      gem.addTrait(new Collectible(global));
      gems.add(gem);
    }
  });

  function cleanup() {
    gems = null;
  }

  return [gems, cleanup];
}

export default createGems;
