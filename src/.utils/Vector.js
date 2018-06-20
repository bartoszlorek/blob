class Vector {
    constructor(x, y) {
        this.x = x || 0
        this.y = y || 0
    }

    /**
     *  Utility
     */
    clone() {
        return new Vector(this.x, this.y)
    }

    equals(vector) {
        return this.x === vector.x && this.y === vector.y
    }

    /**
     *  Properties
     */
    get lengthSq() {
        return this.dot(this)
    }

    get length() {
        return Math.sqrt(this.lengthSq)
    }

    set length(value) {
        let length = this.length
        if (length !== 0 && value !== length) {
            this.multiplyScalar(value / length)
        }
    }

    get rad() {
        return Math.atan2(this.x, this.y)
    }

    set rad(value) {
        this.set(
            Math.cos(value) * this.length,
            Math.sin(value) * this.length
        )
    }

    get deg() {
        return (this.rad * 180) / Math.PI
    }

    set deg(value) {
        this.rad = (value * Math.PI) / 180
    }

    /**
     *  Manipulation
     */
    set(x, y) {
        this.x = x
        this.y = y
        return this
    }

    setX(x) {
        this.x = x
        return this
    }

    setY(y) {
        this.y = y
        return this
    }

    add(vector) {
        this.x += vector.x
        this.y += vector.y
        return this
    }

    subtract(vector) {
        this.x -= vector.x
        this.y -= vector.y
        return this
    }

    multiply(vector) {
        this.x *= vector.x
        this.y *= vector.y
        return this
    }

    divide(vector) {
        this.x = vector.x ? this.x * (1 / vector.x) : 0
        this.y = vector.y ? this.y * (1 / vector.y) : 0
        return this
    }

    multiplyScalar(value) {
        this.x *= value
        this.y *= value
        return this
    }

    divideScalar(value) {
        if (value === 0) {
            this.x = 0
            this.y = 0
        } else {
            let invScalar = 1 / value
            this.x *= invScalar
            this.y *= invScalar
        }
        return this
    }

    invert() {
        this.x *= -1
        this.y *= -1
        return this
    }

    limit(value) {
        if (this.length > value) {
            this.length = value
        }
        return this
    }

    rotate(theta) {
        let xValue = this.x
        this.x = this.x * Math.cos(theta) - this.y * Math.sin(theta)
        this.y = xValue * Math.sin(theta) + this.y * Math.cos(theta)
        return this
    }

    normalize() {
        return this.divideScalar(this.length)
    }

    lerp(vector, alpha) {
        this.x += (vector.x - this.x) * alpha
        this.y += (vector.y - this.y) * alpha
        return this
    }

    /**
     *  Products
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y
    }

    cross(vector) {
        return this.x * vector.y - this.y * vector.x
    }

    distanceSq(vector) {
        var dx = this.x - vector.x,
            dy = this.y - vector.y
        return dx * dx + dy * dy
    }

    distance(vector) {
        return Math.sqrt(this.distanceSq(vector))
    }
}

export default Vector
