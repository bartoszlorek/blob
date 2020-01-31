import {Sprite} from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';

import Group from '@core/structure/Group';
import Body from '@core/physics/Body';

const glowDistance = 10;

function createGems({global, spriteset}) {
  const {sprites} = spriteset.layers['gems'];

  let gems = new Group();
  let filters = [new GlowFilter(glowDistance, 1, 0, 0xf2dc30)];
  filters[0].padding = glowDistance;

  sprites.forEach(sprite => {
    const {id, position} = sprite;
    const gem = new Body(
      new Sprite(spriteset.spritesheet.getById(id)),
      position[0] * spriteset.tilesize,
      position[1] * spriteset.tilesize,
      spriteset.tilesize
    );

    // gem.sprite.filters = filters;
    gems.add(gem);
  });

  function cleanup() {
    gems = null;
    filters = null;
  }

  return [gems, cleanup];
}

export default createGems;
