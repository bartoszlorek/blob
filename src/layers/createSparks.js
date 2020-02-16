// @flow strict

import AnimatedSprite from '@core/AnimatedSprite';

import type Spritesheet from '@core/structure/Spritesheet';
import type {KeyframesType} from '@core/Animation';

const spriteId = 208;

function createSparks(spritesheet: Spritesheet) {
  const keyframes: KeyframesType = {
    shine: {
      frame: 0,
      firstId: spriteId,
      lastId: spriteId + 5,
    },
  };

  const sprite = new AnimatedSprite(spritesheet.getById(spriteId));
  sprite.animation.keyframes = keyframes;
  return sprite;
}

export default createSparks;
