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
        this.forEachBlob(blob => {
            this.shape.drawRect(
                glob.rootX + blob.left,
                glob.rootY + blob.top,
                blob.size,
                blob.size
            )
        })
    }

    update(deltaTime) {
        this.forEachBlob(blob => {
            blob.update(deltaTime)
        })
    }

    intersection(otherBlob) {
        let matches = []
        this.forEachBlob(blob => {
            if (blob.intersection(otherBlob)) {
                matches.push(blob)
            }
        })
        return matches
    }

    addBlob(blob) {
        this.blobs.add(blob)
        blob.mesh = this
    }

    removeBlob(blob) {
        this.blobs.remove(blob)
    }

    forEachBlob(iteratee) {
        this.blobs.forEach(iteratee)
    }
}

export default Mesh
