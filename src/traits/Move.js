import Trait from './Trait'

class Move extends Trait {
    constructor() {
        super('move')
        this.dir = 0
        this.acceleration = 0.75
        this.deceleration = 0.5
        this.dragFactor = 0.9
    }

    update(entity, deltaTime) {
        let absX = Math.abs(entity.vel.x)

        if (this.dir !== 0) {
            entity.vel.x += this.acceleration * deltaTime * this.dir

        } else if (entity.vel.x !== 0) {
            let deceleration = Math.min(absX, this.deceleration * deltaTime)
            entity.vel.x += entity.vel.x > 0 ? -deceleration : deceleration
        }

        entity.vel.x *= this.dragFactor
    }
}

export default Move
