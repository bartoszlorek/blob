import Trait from './Trait'
import { EDGE } from '../models/Entity'

class Jump extends Trait {
    constructor() {
        super('jump')
        this.velocity = 200
        this.duration = 0.3
        this.gracePeriod = 0.1 // jump again before landing

        this.ready = 0
        this.requestTime = 0
        this.engageTime = 0
    }

    get falling() {
        return this.ready < 0
    }

    start() {
        this.requestTime = this.gracePeriod
    }

    cancel() {
        this.requestTime = 0
        this.engageTime = 0
    }

    update(entity, deltaTime) {
        if (this.requestTime > 0) {
            if (this.ready > 0) {
                this.engageTime = this.duration
                this.requestTime = 0
            }
            this.requestTime -= deltaTime
        }

        if (this.engageTime > 0) {
            entity.vel.y = -this.velocity
            this.engageTime -= deltaTime
        }

        this.ready--
    }

    obstruct(entity, edge) {
        if (edge.local === EDGE.BOTTOM) {
            this.ready = 1
        } else if (edge.local === EDGE.TOP) {
            this.cancel()
        }
    }
}

export default Jump
