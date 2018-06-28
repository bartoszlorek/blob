import Layer from '../models/Layer'
import Entity from '../models/Entity'

const GROUND_COLOR = 0xdb1278

function createGround(global, level, data) {
    const layer = new Layer('ground', GROUND_COLOR)
    layer.level = level || null

    data.forEach(pos => {
        const entity = new Entity(
            global.gridToLocal(pos[0]),
            global.gridToLocal(pos[1]),
            global.size
        )
        layer.append(entity)
    })

    return layer
}

export default createGround
