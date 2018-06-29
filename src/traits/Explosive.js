import forEach from '../.utils/forEach'
import Entity from '../models/Entity'

import Trait from './Trait'
import Blink from './Blink'
import Animation from './Animation'

class Explosive extends Trait {
    constructor(range = 0) {
        super('explosive')
        this.range = range
        this.timer = 0.25

        this.ignition = -1
        this.exploded = false
    }

    start() {
        this.ignition++
    }

    update(entity, deltaTime) {
        if (this.ignition < 0 || this.exploded) {
            return false
        }
        if (this.ignition === 0) {
            entity.addTrait(new Blink(0.1))
            this.ignition++

        } else if (this.timer < 0) {
            this.exploded = true

            const { level } = entity.parent
            const blast = new Entity(
                entity.pos.x,
                entity.pos.y,
                entity.size
            )
            level.effect.append(blast)
            blast.addTrait(new Animation())
            blast.animation
                .add('blast', [
                    [0.01, () => blast.size += this.range],
                    [0.10, () => blast.size += this.range],
                    [0.18, () => blast.size -= this.range / 2],
                    [0.20, () => this.destroy(blast)]
                ])
                .play('blast')

            const affected = this.affect(entity, [
                level.ground,
                level.player
            ])
            affected.forEach(this.destroy)
            this.destroy(entity)

            if (level.player.head) {
                level.player.head.physics.fields.calculate()
            } else {
                // todo: proper game over
                setTimeout(() => level.gameOver(), 1000)
            }
        }

        this.timer -= deltaTime
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
