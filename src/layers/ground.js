import Layer from '../models/Layer'
import Entity from '../models/Entity'

const GROUND_COLOR = 0xd91677

function createGround(data, global, level) {
    const layer = new Layer('ground', GROUND_COLOR)
    layer.solid = true

    if (data['ground']) {
        data['ground'].forEach(pos => {
            const entity = new Entity(
                global.gridToLocal(pos[0]),
                global.gridToLocal(pos[1]),
                global.size
            )
            layer.append(entity)
        })
    }

    return layer
}

export default createGround
