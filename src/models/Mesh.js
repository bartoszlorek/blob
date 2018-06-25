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
        //this.shape.lineStyle(1, 0xffffff)
    }

    render(glob) {
        this.clear()
        this.blobs.forEach(blob => {
            this.shape.drawRect(
                glob.rootX + blob.left,
                glob.rootY + blob.top,
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
        let top,
            bottom,
            left,
            right

        this.blobs.forEach(blob => {
            if (top === undefined || blob.top < top) {
                top = blob.top
            }
            if (bottom === undefined || blob.bottom > bottom) {
                bottom = blob.bottom
            }
            if (right === undefined || blob.right > right) {
                right = blob.right
            }
            if (left === undefined || blob.left < left) {
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
