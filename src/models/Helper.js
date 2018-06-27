import { Graphics } from 'pixi.js'

class Helper {
    constructor(data) {
        this.data = data
        this.graphics = new Graphics()
    }

    renderBox(global) {
        this.graphics.clear()
        this.graphics.lineStyle(1)
        this.graphics.drawRect(
            global.rootX + this.data.left,
            global.rootY + this.data.top,
            Math.abs(this.data.left) + Math.abs(this.data.right),
            Math.abs(this.data.top) + Math.abs(this.data.bottom)
        )
    }

    renderPoint(global) {

    }
}

export default Helper
