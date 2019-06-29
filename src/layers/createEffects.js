import {GlowFilter} from '@pixi/filter-glow';
import Layer from '@models/Layer';

function createEffects(global, {}) {
  const layer = new Layer('effects');

  layer.filters([new GlowFilter(15, 1, 0, 0xffffff)]);
  return layer;
}

export default createEffects;
