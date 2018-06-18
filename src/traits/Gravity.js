import Trait from './Trait'

export const GRAVITY = 0.25

class Gravity extends Trait {
    constructor() {
        super('gravity')
    }

    update(entity, deltaTime) {
        entity.vel.y += GRAVITY * deltaTime
    }
}

export default Gravity
