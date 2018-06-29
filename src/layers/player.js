import Keyboard from '../models/Keyboard'
import Layer from '../models/Layer'
import Entity from '../models/Entity'

import Physics from '../traits/Physics'
import Killable from '../traits/Killable'
import Move from '../traits/Move'
import Jump from '../traits/Jump'

const PLAYER_COLOR = 0x00fd83

function createPlayer(global, level, data) {
    const layer = new Layer('player', PLAYER_COLOR)
    const entity = new Entity(0, -250, global.size)
    layer.level = level || null
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
