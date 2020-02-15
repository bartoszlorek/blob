// @flow strict

import AnimatedSprite from '@core/AnimatedSprite';

import type SpritesheetGroup from '@core/structure/SpritesheetGroup';
import type {KeyframesType} from '@core/Animation';

const spriteId = 208;

function createSparks(spritesheet: SpritesheetGroup) {
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
