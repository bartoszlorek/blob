import { toOffset } from '../.internal/transform'
const X_RATIO = toOffset(1).x

function Blob(x, y) {
    this.x = x
    this.y = y
    this.size = 1
}

Blob.prototype = {
    get posX() {
        return this.x * X_RATIO
    },

    set posX(x) {
        this.x = x / X_RATIO
    },

    get posY() {
        return this.y
    },

    set posY(y) {
        this.y = y
    },

    get top() {
        return this.posY - this.size
    },

    get bottom() {
        return this.posY + this.size
    },

    get left() {
        return this.posX - this.size
    },

    get right() {
        return this.posX + this.size
    },

    set: function(x, y) {
        this.x = x
        this.y = y
    },

    setPos: function(x, y) {
        this.posX = x
        this.posY = y
    },

    setFromObject: function(obj) {
        this.set(obj.x, obj.y)
    },

    setFromArray: function(arr) {
        this.set(arr[0], arr[1])
    },

    distance: function(blob) {
        let x = this.posX - blob.posX,
            y = this.posY - blob.posY
        return Math.sqrt(x * x + y * y)
    },

    intersection: function(blob) {
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
        if (dist > this.size + blob.size) {
            return false
        }
        return true
    }
}

Blob.fromObject = function(obj) {
    return new Blob(obj.x, obj.y)
}

Blob.fromArray = function(arr) {
    return new Blob(arr[0], arr[1])
}

export default Blob
