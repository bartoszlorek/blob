import Trait from './Trait'
import { EDGE } from '../models/Blob'

export const DIR = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right')
}

class Physics extends Trait {
    constructor(level) {
        super('physics')
        this.level = level
        this.dir = DIR.BOTTOM
        this.gravity = 0.25

        this.bounds = {}
        this.solids = []
        this.bodies = []
    }

    update(entity, deltaTime) {
        this.checkDirection(entity)

        let { x } = this.rotateVelocity(entity, this.dir)
        entity.pos.x += x * deltaTime
        this.checkX(entity, x)

        let { y } = this.rotateVelocity(entity, this.dir)
        entity.pos.y += y * deltaTime
        this.checkY(entity, y)

        entity.vel.y += this.gravity * deltaTime
    }

    checkX(entity, x) {
        let matches = this.solids.intersection(entity)
        matches.forEach(match => {
            if (x > 0) {
                if (entity.right > match.left) {
                    entity.obstruct(EDGE.RIGHT, match)
                }
            } else if (x < 0) {
                if (entity.left < match.right) {
                    entity.obstruct(EDGE.LEFT, match)
                }
            }
        })
    }

    checkY(entity, y) {
        let matches = this.solids.intersection(entity)
        matches.forEach(match => {
            if (y > 0) {
                if (entity.bottom > match.top) {
                    entity.obstruct(EDGE.BOTTOM, match)
                }
            } else if (y < 0) {
                if (entity.top < match.bottom) {
                    entity.obstruct(EDGE.TOP, match)
                }
            }
        })
    }

    obstruct(entity, edge, match) {
        let vertical = this.dir === DIR.TOP || this.dir === DIR.BOTTOM

        if (edge === EDGE.BOTTOM) {
            entity.bottom = match.top
            entity.vel[vertical ? 'y' : 'x'] = 0

        } else if (edge === EDGE.TOP) {
            entity.top = match.bottom
            entity.vel[vertical ? 'y' : 'x'] = 0

        } else if (edge === EDGE.LEFT) {
            entity.left = match.right
            entity.vel[vertical ? 'x' : 'y'] = 0

        } else if (edge === EDGE.RIGHT) {
            entity.right = match.left
            entity.vel[vertical ? 'x' : 'y'] = 0
        }
    }

    // gravity direction:
    // bottom  x: x  y: y
    // top     x:-x  y:-y
    // left    x:-y  y: x
    // right   x: y  y:-x

    rotateVelocity(entity, dir) {
        let x = entity.vel.x,
            y = entity.vel.y

        if (dir === DIR.TOP) {
            return {
                x: -x,
                y: -y
            }
        }
        if (dir === DIR.LEFT) {
            return {
                x: -y,
                y: x
            }
        }
        if (dir === DIR.RIGHT) {
            return {
                x: y,
                y: -x
            }
        }
        return {
            x,
            y
        }
    }

    checkDirection(entity) {
        if (entity.left > this.bounds.left &&
            entity.right < this.bounds.right &&
            entity.bottom < this.bounds.top) {
            return this.dir = DIR.BOTTOM
        }
        if (entity.left > this.bounds.left &&
            entity.right < this.bounds.right &&
            entity.top > this.bounds.bottom) {
            return this.dir = DIR.TOP
        }
        if (entity.top > this.bounds.top &&
            entity.bottom < this.bounds.bottom &&
            entity.left > this.bounds.right) {
            return this.dir = DIR.LEFT
        }
        if (entity.top > this.bounds.top &&
            entity.bottom < this.bounds.bottom &&
            entity.right < this.bounds.left) {
            return this.dir = DIR.RIGHT
        }
    }

    add(mesh) {
        this.solids = mesh
        this.bounds = mesh.bounds()
    }
}

export default Physics
