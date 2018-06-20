import Trait from './Trait'

class Move extends Trait {
    constructor() {
        super('move')
        this.dir = 0
        this.speed = .2
    }

    update(entity, deltaTime) {
        entity.vel.x += this.speed * this.dir * deltaTime
    }
}

export default Move
