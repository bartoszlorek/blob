import Keyboard from '../models/Keyboard'
import Layer from '../models/Layer'
import Entity from '../models/Entity'

import Physics from '../traits/Physics'
import Killable from '../traits/Killable'
import Move from '../traits/Move'
import Jump from '../traits/Jump'

function createPlayer(global) {
    const layer = new Layer('player', 0x01fe81)
    const entity = new Entity(0, -250, global.size)
    layer.append(entity)

    entity.addTrait(new Physics(global))
    entity.addTrait(new Killable())
    entity.addTrait(new Move())
    entity.addTrait(new Jump())

    const input = new Keyboard()
    input.on('ArrowRight', state => {
        entity.move.dir += state ? 1 : -1
    })

    input.on('ArrowLeft', state => {
        entity.move.dir += state ? -1 : 1
    })

    input.on('Space', state => {
        if (state) {
            entity.jump.start()
        } else {
            entity.jump.cancel()
        }
    })

    return layer
}

export default createPlayer
