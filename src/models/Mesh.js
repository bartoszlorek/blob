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

    render(spec) {
        this.clear()
        this.blobs.forEach(blob => {
            this.shape.drawCircle(
                spec.rootX + blob.pos.x,
                spec.rootY + blob.pos.y,
                blob.radius
            )
        })
    }

    update(deltaTime, spec) {
        this.blobs.forEach(blob => {
            blob.update(deltaTime, spec)
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

    intersectionX(otherBlob) {
        let matches = []
        this.blobs.forEach(blob => {
            if (blob.intersectionX(otherBlob)) {
                matches.push(blob)
            }
        })
        return matches
    }

    intersectionY(otherBlob) {
        let matches = []
        this.blobs.forEach(blob => {
            if (blob.intersectionY(otherBlob)) {
                matches.push(blob)
            }
        })
        return matches
    }
}

export default Mesh
