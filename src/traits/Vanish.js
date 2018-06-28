import Trait from './Trait'

class Vanish extends Trait {
    constructor(timeout = 1) {
        super('vanish')
        this.timeout = 0
    }

    update(entity, deltaTime) {

    }
}

export default Vanish
