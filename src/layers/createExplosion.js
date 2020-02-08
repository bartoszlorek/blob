// @flow strict

import AnimatedSprite from '@core/AnimatedSprite';

import type SpritesheetGroup from '@core/structure/SpritesheetGroup';
import type {KeyframesType} from '@core/Animation';

const spriteId = 357;

function createExplosion(spritesheet: SpritesheetGroup) {
  const keyframes: KeyframesType = {
    explode: {
      frame: 0,
      firstId: spriteId + 0,
      lastId: spriteId + 6,
    },
  };

  const sprite = new AnimatedSprite(spritesheet.getById(spriteId));
  sprite.animation.keyframes = keyframes;
  return sprite;
}

export default createExplosion;
