import Trait from './Trait'

class Explosive extends Trait {
    constructor(level) {
        super('explosive')
        this.level = level
        this.touched = false
        this.timeout = 0.25
    }

    start() {
        this.touched = true
    }

    update(entity, deltaTime) {
        if (!this.touched) {
            return
        }
        if (this.timeout < 0) {
            entity.parent.remove(entity)
            console.log('boom!')
        }
        this.timeout -= deltaTime
    }
}

export default Explosive
