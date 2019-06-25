import {GlowFilter} from '@pixi/filter-glow';
import Layer from '@models/Layer';

function createEffects(global, {}) {
  const color = 0xffffff;
  const layer = new Layer('effects', color);

  layer.filters([new GlowFilter(15, 1, 0, color)]);
  return layer;
}

export default createEffects;
