import { GlowFilter } from '@pixi/filter-glow'
import Layer from '../models/Layer'

const EFFECTS_COLOR = 0xffffff

function createEffects(data, global, level) {
    const layer = new Layer('effects', EFFECTS_COLOR)
    layer.graphics.filters = [new GlowFilter(15, 1, 0, EFFECTS_COLOR)]

    return layer
}

export default createEffects
