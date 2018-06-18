import { Point } from 'pixi.js'
import {
    fromGridX,
    fromGridY,
    fromGlobalX,
    fromGlobalY
} from '../.internal/math'

class Blob {
    constructor(x = 0, y = 0, radius = 1) {
        this.pos = new Point(x, y)
        this.vel = new Point(0, 0)
        this.radius = radius
        this.traits = []
    }

    get top() {
        return this.pos.y - this.radius
    }

    get bottom() {
        return this.pos.y + this.radius
    }

    get left() {
        return this.pos.x - this.radius
    }

    get right() {
        return this.pos.x + this.radius
    }

    distance(blob) {
        let x = this.pos.x - blob.pos.x,
            y = this.pos.y - blob.pos.y
        return Math.sqrt(x * x + y * y)
    }

    intersection(blob) {
        let overlap =
            this.top < blob.bottom &&
            this.bottom > blob.top &&
            this.right > blob.left &&
            this.left < blob.right

        // basic box overlapping
        if (overlap === false) {
            return false
        }
        // distance overlapping
        let dist = this.distance(blob)
        if (dist > this.radius + blob.radius) {
            return false
        }
        return true
    }

    intersectionX(blob) {
        let overlap =
            this.right > blob.left &&
            this.left < blob.right

        // basic box overlapping
        if (overlap === false) {
            return false
        }
        // distance overlapping
        let dist = this.distance(blob)
        if (dist > this.radius + blob.radius) {
            return false
        }
        return true
    }

    intersectionY(blob) {
        let overlap =
            this.top < blob.bottom &&
            this.bottom > blob.top

        // basic box overlapping
        if (overlap === false) {
            return false
        }
        // distance overlapping
        let dist = this.distance(blob)
        if (dist > this.radius + blob.radius) {
            return false
        }
        return true
    }

    setFromGrid(spec, x, y) {
        this.pos.set(
            fromGridX(spec, x),
            fromGridY(spec, y)
        )
    }

    setFromGlobal(spec, x, y) {
        this.pos.set(
            fromGlobalX(spec, x),
            fromGlobalY(spec, y)
        )
    }

    static fromGrid(spec, x, y, radius) {
        if (radius === undefined) {
            radius = spec.radius
        }
        return new Blob(
            fromGridX(spec, x),
            fromGridY(spec, y),
            radius
        )
    }

    static fromGlobal(spec, x, y, radius) {
        if (radius === undefined) {
            radius = spec.radius
        }
        return new Blob(
            fromGlobalX(spec, x),
            fromGlobalY(spec, y),
            radius
        )
    }

    addTrait(trait) {
        this.traits.push(trait)
        this[trait.name] = trait
    }

    update(deltaTime, spec) {
        let index = -1
        const length = this.traits.length
        while (++index < length) {
            this.traits[index].update(this, deltaTime, spec)
        }
    }
}

export default Blob
