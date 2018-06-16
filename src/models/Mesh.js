import { Graphics } from 'pixi.js'
import Container from '../.utils/Container'

function Mesh(name, color = 0xe6e6e6) {
    this.name = name
    this.color = color
    this.shape = new Graphics()
    this.blobs = new Container()
}

Mesh.prototype = {
    clear: function() {
        this.shape.clear()
        this.shape.beginFill(this.color)
        this.shape.lineStyle(1, 0xffffff)
    },

    render: function(spec) {
        this.clear()
        this.blobs.forEach(blob => {
            this.shape.drawCircle(
                spec.rootX + spec.offsetX * blob.x,
                spec.rootY + spec.offsetY * blob.y,
                spec.radius * blob.size
            )
        })
    },

    intersection: function(otherBlob) {
        let result = false
        this.blobs.forEach(blob => {
            if (blob.intersection(otherBlob)) {
                result = true
                return false
            }
        })
        return result
    }
}

export default Mesh
