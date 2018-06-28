import forEach from '../.utils/forEach'
import Trait from './Trait'

class Explosive extends Trait {
    constructor(range = 0) {
        super('explosive')
        this.touched = false
        this.timeout = 0.25
        this.range = range
    }

    start() {
        this.touched = true
    }

    update(bomb, deltaTime) {
        if (!this.touched) {
            return
        }
        if (this.timeout < 0) {
            const { level } = bomb.parent
            const affected = this.affect(bomb, [
                level.ground,
                level.player
            ])
            affected.forEach(this.destroy)
            this.destroy(bomb)

            if (level.player.head) {
                level.player.head.physics.fields.calculate()
            }
        }
        this.timeout -= deltaTime
    }

    affect(bomb, layers) {
        let result = []
        forEach(layers, layer => {
            layer.forEach(entity => {
                if (this.intersection(bomb, entity)) {
                    result.push(entity)
                }
            })
        })
        return result
    }

    destroy(entity) {
        entity.parent.remove(entity)
    }

    intersection(bomb, entity) {
        return bomb.top - this.range < entity.bottom
            && bomb.bottom + this.range > entity.top
            && bomb.right + this.range > entity.left
            && bomb.left - this.range < entity.right
    }
}

export default Explosive
