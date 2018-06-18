import Trait from './Trait'
import { GRAVITY } from './Gravity'

const sign = value => (value > 0 ? 1 : -1)

class Physics extends Trait {
    constructor() {
        super('physics')
        this.factor = 0.5

        // todo: array instead of single mesh
        this.collider = null
    }

    update(entity, deltaTime, spec) {
        entity.pos.x += entity.vel.x * deltaTime
        this.checkX(entity, deltaTime)

        entity.pos.y += entity.vel.y * deltaTime
        this.checkY(entity, deltaTime)

        entity.vel.y += GRAVITY * deltaTime
    }

    potential(entity, match) {
        let value = (match.pos.y - entity.pos.y) / match.radius
        return value > 1 ? 1 : (value < 0 ? 0 : value)
    }

    friction(entity, match, absolute = true) {
        let position = match.pos.x - entity.pos.x,
            distance = match.radius + entity.radius,
            friction = Math.abs(position / distance)

        friction *= this.potential(entity, match)
        return absolute ? friction : friction * sign(position)
    }

    checkX(entity, deltaTime) {
        let matches = this.collider.intersectionX(entity)
        matches.forEach(match => {
            entity.vel.y -= this.friction(entity, match) + this.factor
            entity.pos.x -= entity.vel.x * deltaTime
            entity.vel.x = 0
        })
    }

    checkY(entity, deltaTime) {
        let matches = this.collider.intersectionY(entity)
        matches.forEach(match => {
            entity.pos.x -= this.friction(entity, match, false) * this.factor
            entity.pos.y -= entity.vel.y * deltaTime
            entity.vel.y = 0
        })
    }

    add(mesh) {
        this.collider = mesh
    }
}

export default Physics
