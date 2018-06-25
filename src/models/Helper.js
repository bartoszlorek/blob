import { Graphics } from 'pixi.js'

class Helper {
    constructor(data) {
        this.data = data
        this.shape = new Graphics()
    }

    renderBox(glob) {
        this.shape.clear()
        this.shape.lineStyle(1)
        this.shape.drawRect(
            glob.rootX + this.data.left,
            glob.rootY + this.data.top,
            Math.abs(this.data.left) + Math.abs(this.data.right),
            Math.abs(this.data.top) + Math.abs(this.data.bottom)
        )
    }

    renderPoint(glob) {

    }
}

export default Helper
