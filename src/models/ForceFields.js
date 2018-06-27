import forEach from '../.utils/forEach'

class ForceFields {
    constructor(radius = 1) {
        this.radius = radius
        this.layers = []
        this.bounds = {}
    }

    inTop(pos) {
        return pos.x > this.bounds.left
            && pos.x < this.bounds.right
            && pos.y < this.bounds.top
    }

    inRight(pos) {
        return pos.y > this.bounds.top
            && pos.y < this.bounds.bottom
            && pos.x > this.bounds.right
    }

    inBottom(pos) {
        return pos.x > this.bounds.left
            && pos.x < this.bounds.right
            && pos.y > this.bounds.bottom
    }

    inLeft(pos) {
        return pos.y > this.bounds.top
            && pos.y < this.bounds.bottom
            && pos.x < this.bounds.left
    }

    calculate() {
        let maxLeft = 0,
            maxRight = 0

        // maximum horizontal positions
        forEach(this.layers, layer => {
            layer.forEach(entity => {
                if (entity.left < maxLeft) {
                    maxLeft = entity.left
                }
                if (entity.right > maxRight) {
                    maxRight = entity.right
                }
            })
        })

        let maxTopLeft = 0,
            maxTopRight = 0,
            maxBottomLeft = 0,
            maxBottomRight = 0

        // maximum vertical positions in radius
        forEach(this.layers, layer => {
            layer.forEach(entity => {
                if (entity.pos.x < maxLeft + this.radius) {
                    if (entity.top < maxTopLeft) {
                        maxTopLeft = entity.top
                    }
                    if (entity.bottom > maxBottomLeft) {
                        maxBottomLeft = entity.bottom
                    }
    
                } else if (entity.pos.x > maxRight - this.radius) {
                    if (entity.top < maxTopRight) {
                        maxTopRight = entity.top
                    }
                    if (entity.bottom > maxBottomRight) {
                        maxBottomRight = entity.bottom
                    }
                }
            })
        })

        this.bounds = {
            top: Math.max(maxTopLeft, maxTopRight),
            bottom: Math.min(maxBottomLeft, maxBottomRight),
            left: maxLeft,
            right: maxRight
        }
    }
}

export default ForceFields
