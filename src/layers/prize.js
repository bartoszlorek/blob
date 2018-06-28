import { GlowFilter } from '@pixi/filter-glow'
import Layer from '../models/Layer'
import Entity from '../models/Entity'

import Shine from '../traits/Shine'

const PRIZE_COLOR = 0xf7dd2c

function createPrize(global, level, data) {
    const layer = new Layer('prize', PRIZE_COLOR)
    layer.level = level || null

    layer.graphics.filters = [
        new GlowFilter(10, 1, 0, PRIZE_COLOR)
    ]

    data.forEach(pos => {
        const entity = new Entity(
            global.gridToLocal(pos[0]),
            global.gridToLocal(pos[1]),
            global.size
        )
        entity.addTrait(new Shine(global.size))
        layer.append(entity)
    })

    return layer
}

export default createPrize
