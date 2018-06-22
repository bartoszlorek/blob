import Trait from './Trait'
import { EDGE, EDGE_ORDER } from '../models/Blob'

export const DIR = {
    TOP: Symbol('top'),
    RIGHT: Symbol('right'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left')
}

export const DIR_SHIFT = {
    [DIR.TOP]: 2,
    [DIR.RIGHT]: 1,
    [DIR.BOTTOM]: 0,
    [DIR.LEFT]: 3
}

class Physics extends Trait {
    constructor() {
        super('physics')
        this.gravity = 1000
        this.dir = DIR.BOTTOM

        this.bounds = {}
        this.solids = []
    }

    update(entity, deltaTime) {
        this.checkDirection(entity)

        let { x } = this.rotateVector(entity.vel)
        entity.pos.x += x * deltaTime
        this.checkX(entity, x)

        let { y } = this.rotateVector(entity.vel)
        entity.pos.y += y * deltaTime
        this.checkY(entity, y)

        entity.vel.y += this.gravity * deltaTime
    }

    checkX(entity, x) {
        let matches = this.solids.intersection(entity),
            index = -1

        const length = matches.length
        while (++index < length) {
            let match = matches[index]
            if (x > 0) {
                if (entity.right > match.left) {
                    entity.obstruct(this.rotateEdge(EDGE.RIGHT), match)
                }
            } else if (x < 0) {
                if (entity.left < match.right) {
                    entity.obstruct(this.rotateEdge(EDGE.LEFT), match)
                }
            }
        }
    }

    checkY(entity, y) {
        let matches = this.solids.intersection(entity),
            index = -1

        const length = matches.length
        while (++index < length) {
            let match = matches[index]
            if (y > 0) {
                if (entity.bottom > match.top) {
                    entity.obstruct(this.rotateEdge(EDGE.BOTTOM), match)
                }
            } else if (y < 0) {
                if (entity.top < match.bottom) {
                    entity.obstruct(this.rotateEdge(EDGE.TOP), match)
                }
            }
        }
    }

    checkDirection(entity) {
        if (entity.left > this.bounds.left &&
            entity.right < this.bounds.right &&
            entity.bottom < this.bounds.top) {
            return (this.dir = DIR.BOTTOM)
        }
        if (entity.left > this.bounds.left &&
            entity.right < this.bounds.right &&
            entity.top > this.bounds.bottom) {
            return (this.dir = DIR.TOP)
        }
        if (entity.top > this.bounds.top &&
            entity.bottom < this.bounds.bottom &&
            entity.left > this.bounds.right) {
            return (this.dir = DIR.LEFT)
        }
        if (entity.top > this.bounds.top &&
            entity.bottom < this.bounds.bottom &&
            entity.right < this.bounds.left) {
            return (this.dir = DIR.RIGHT)
        }
    }

    obstruct(entity, edge, match) {
        let vertical = this.dir === DIR.TOP || this.dir === DIR.BOTTOM

        if (edge.global === EDGE.BOTTOM) {
            entity.bottom = match.top
            entity.vel[vertical ? 'y' : 'x'] = 0

        } else if (edge.global === EDGE.TOP) {
            entity.top = match.bottom
            entity.vel[vertical ? 'y' : 'x'] = 0
 
        } else if (edge.global === EDGE.LEFT) {
            entity.left = match.right
            entity.vel[vertical ? 'x' : 'y'] = 0

        } else if (edge.global === EDGE.RIGHT) {
            entity.right = match.left
            entity.vel[vertical ? 'x' : 'y'] = 0
        }
    }

    rotateVector(vector) {
        let x = vector.x,
            y = vector.y

        switch (this.dir) {
            case DIR.TOP:
                return {
                    x: -x,
                    y: -y
                }
            case DIR.BOTTOM:
            default:
                return {
                    x,
                    y
                }
            case DIR.LEFT:
                return {
                    x: -y,
                    y: x
                }
            case DIR.RIGHT:
                return {
                    x: y,
                    y: -x
                }
        }
    }

    rotateEdge(edge) {
        let globalIndex = EDGE_ORDER.indexOf(edge)
        if (globalIndex !== -1) {
            let localIndex =
                (globalIndex + DIR_SHIFT[this.dir]) % EDGE_ORDER.length
            return {
                global: EDGE_ORDER[globalIndex],
                local: EDGE_ORDER[localIndex]
            }
        } else {
            return {
                global: EDGE.BOTTOM,
                local: EDGE.BOTTOM
            }
        }
    }

    add(mesh) {
        this.solids = mesh
        this.bounds = mesh.bounds()
    }
}

export default Physics
