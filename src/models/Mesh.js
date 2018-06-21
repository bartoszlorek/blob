import { Graphics } from 'pixi.js'
import Container from '../.utils/Container'

class Mesh {
    constructor(name, color = 0xe6e6e6) {
        this.name = name
        this.color = color
        this.shape = new Graphics()
        this.blobs = new Container()
    }

    get root() {
        return this.blobs.items[0]
    }

    clear() {
        this.shape.clear()
        this.shape.beginFill(this.color)
    }

    render(spec) {
        this.clear()
        this.blobs.forEach(blob => {
            this.shape.drawRect(
                spec.rootX + blob.pos.x - blob.size / 2,
                spec.rootY + blob.pos.y - blob.size / 2,
                blob.size,
                blob.size
            )
        })
    }

    update(deltaTime) {
        this.blobs.forEach(blob => {
            blob.update(deltaTime)
        })
    }

    intersection(otherBlob) {
        let matches = []
        this.blobs.forEach(blob => {
            if (blob.intersection(otherBlob)) {
                matches.push(blob)
            }
        })
        return matches
    }

    bounds() {
        let top = 0,
            bottom = 0,
            left = 0,
            right = 0

        this.blobs.forEach(blob => {
            if (blob.top < top) {
                top = blob.top
            }
            if (blob.bottom > bottom) {
                bottom = blob.bottom
            }
            if (blob.right > right) {
                right = blob.right
            }
            if (blob.left < left) {
                left = blob.left
            }
        })
        return {
            top,
            bottom,
            left,
            right
        }
    }
}

export default Mesh
