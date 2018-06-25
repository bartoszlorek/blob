import Vector from '../.utils/Vector'

export const EDGE = {
    TOP: Symbol('top'),
    RIGHT: Symbol('right'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left')
}

export const EDGE_TABLE = [
    EDGE.TOP,
    EDGE.RIGHT,
    EDGE.BOTTOM,
    EDGE.LEFT
]

class Blob {
    constructor(x = 0, y = 0, size = 1) {
        this.pos = new Vector(x, y)
        this.vel = new Vector(0, 0)
        this.size = size
        this.mesh = null
        this.traits = []
    }

    get top() {
        return this.pos.y - this.size / 2
    }

    set top(y) {
        return this.pos.y = y + this.size / 2
    }

    get bottom() {
        return this.pos.y + this.size / 2
    }

    set bottom(y) {
        return this.pos.y = y - this.size / 2
    }

    get left() {
        return this.pos.x - this.size / 2
    }

    set left(x) {
        return this.pos.x = x + this.size / 2
    }

    get right() {
        return this.pos.x + this.size / 2
    }

    set right(x) {
        return this.pos.x = x - this.size / 2
    }

    intersection(blob) {
        return this.top < blob.bottom
            && this.bottom > blob.top
            && this.right > blob.left
            && this.left < blob.right
    }

    addTrait(trait) {
        this.traits.push(trait)
        this[trait.name] = trait
    }

    update(deltaTime) {
        let index = -1
        const length = this.traits.length
        while (++index < length) {
            this.traits[index].update(this, deltaTime)
        }
    }

    obstruct(edge, match) {
        let index = -1
        const length = this.traits.length
        while (++index < length) {
            this.traits[index].obstruct(this, edge, match)
        }
    }
}

export default Blob
