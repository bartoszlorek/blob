import Trait from './Trait'
import ForceFields from '../models/ForceFields'
import { EDGE, EDGE_TABLE } from '../models/Entity'
import forEach from '../.utils/forEach'

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
    constructor(global) {
        super('physics')
        this.gravity = 1000
        this.dir = DIR.BOTTOM

        this.fields = new ForceFields(global.size)
        this.layers = []
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
        forEach(this.layers, layer => {
            layer.forEach(other => {
                if (entity.intersection(other)) {
                    if (x > 0) {
                        if (entity.right > other.left) {
                            entity.obstruct(this.rotateEdge(EDGE.RIGHT), other)
                        }
                    } else if (x < 0) {
                        if (entity.left < other.right) {
                            entity.obstruct(this.rotateEdge(EDGE.LEFT), other)
                        }
                    }
                }
            })
        })
    }

    checkY(entity, y) {
        forEach(this.layers, layer => {
            layer.forEach(other => {
                if (entity.intersection(other)) {
                    if (y > 0) {
                        if (entity.bottom > other.top) {
                            entity.obstruct(this.rotateEdge(EDGE.BOTTOM), other)
                        }
                    } else if (y < 0) {
                        if (entity.top < other.bottom) {
                            entity.obstruct(this.rotateEdge(EDGE.TOP), other)
                        }
                    }
                }
            })
        })
    }

    checkDirection(entity) {
        if (this.fields.inTop(entity.pos)) {
            this.dir = DIR.BOTTOM

        } else if (this.fields.inBottom(entity.pos)) {
            this.dir = DIR.TOP

        } else if (this.fields.inLeft(entity.pos)) {
            this.dir = DIR.RIGHT

        } else if (this.fields.inRight(entity.pos)) {
            this.dir = DIR.LEFT
        }
    }

    obstruct(entity, edge, match) {
        let vertical =
            this.dir === DIR.TOP ||
            this.dir === DIR.BOTTOM

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
        let globalIndex = EDGE_TABLE.indexOf(edge)
        if (globalIndex !== -1) {
            let localIndex =
                (globalIndex + DIR_SHIFT[this.dir]) % EDGE_TABLE.length
            return {
                global: EDGE_TABLE[globalIndex],
                local: EDGE_TABLE[localIndex]
            }
        } else {
            return {
                global: EDGE.BOTTOM,
                local: EDGE.BOTTOM
            }
        }
    }

    addLayers(...layers) {
        this.layers = this.layers.concat(layers)
        this.fields.layers = this.layers
        this.fields.calculate()
    }
}

export default Physics
