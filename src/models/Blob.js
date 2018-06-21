import Vector from '../.utils/Vector'

export const EDGE = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right')
}

class Blob {
    constructor(x = 0, y = 0, size = 1) {
        this.pos = new Vector(x, y)
        this.vel = new Vector(0, 0)
        this.size = size
        this.traits = []
    }

    get top() {
        return this.pos.y
    }

    set top(y) {
        return this.pos.y = y
    }

    get bottom() {
        return this.pos.y + this.size
    }

    set bottom(y) {
        return this.pos.y = y - this.size
    }

    get left() {
        return this.pos.x
    }

    set left(x) {
        return this.pos.x = x
    }

    get right() {
        return this.pos.x + this.size
    }

    set right(x) {
        return this.pos.x = x - this.size
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
