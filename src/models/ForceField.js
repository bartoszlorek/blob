import forEachMesh from '../.internal/forEachMesh'

class ForceField {
    constructor(radius = 1) {
        this.radius = radius
        this.meshes = []
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

    add(mesh) {
        this.meshes.push(mesh)
        this.calculate()
    }

    calculate() {
        let maxLeft = 0,
            maxRight = 0

        // maximum horizontal positions
        forEachMesh(this.meshes, blob => {
            if (blob.left < maxLeft) {
                maxLeft = blob.left
            }
            if (blob.right > maxRight) {
                maxRight = blob.right
            }
        })

        let maxTopLeft = 0,
            maxTopRight = 0,
            maxBottomLeft = 0,
            maxBottomRight = 0

        // maximum vertical positions in radius
        forEachMesh(this.meshes, blob => {
            if (blob.pos.x < maxLeft + this.radius) {
                if (blob.top < maxTopLeft) {
                    maxTopLeft = blob.top
                }
                if (blob.bottom > maxBottomLeft) {
                    maxBottomLeft = blob.bottom
                }

            } else if (blob.pos.x > maxRight - this.radius) {
                if (blob.top < maxTopRight) {
                    maxTopRight = blob.top
                }
                if (blob.bottom > maxBottomRight) {
                    maxBottomRight = blob.bottom
                }
            }
        })

        this.bounds = {
            top: Math.max(maxTopLeft, maxTopRight),
            bottom: Math.min(maxBottomLeft, maxBottomRight),
            left: maxLeft,
            right: maxRight
        }
    }
}

export default ForceField
