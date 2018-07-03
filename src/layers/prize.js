import { GlowFilter } from '@pixi/filter-glow'
import Layer from '../models/Layer'
import Entity from '../models/Entity'

import Shine from '../traits/Shine'
import Collectable from '../traits/Collectable'

const PRIZE_COLOR = 0xf2dc30

function createPrize(data, global, level) {
    const layer = new Layer('prize', PRIZE_COLOR)
    layer.graphics.filters = [new GlowFilter(10, 1, 0, PRIZE_COLOR)]

    if (data['prize']) {
        data['prize'].forEach(pos => {
            const entity = new Entity(
                global.gridToLocal(pos[0]),
                global.gridToLocal(pos[1]),
                global.size
            )
            entity.addTrait(new Shine(global.size))
            entity.addTrait(new Collectable())
            layer.append(entity)
        })
    }

    return layer
}

export default createPrize
