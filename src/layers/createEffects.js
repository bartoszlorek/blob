import {GlowFilter} from '@pixi/filter-glow';
import Layer from '@models/Layer';

function createEffects(data, global, level) {
  const color = 0xffffff;
  const layer = new Layer('effects', color);
  layer.graphics.filters = [new GlowFilter(15, 1, 0, color)];

  return layer;
}

export default createEffects;
