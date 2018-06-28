import padBounds from '../.utils/padBounds'

const STAGE_PADDING = 10

class Global {
    constructor(app, size = 32) {
        this.app = app
        this.size = size
        this.time = 1/60
        this.resize()
        this.update()

        window.addEventListener('resize', () => {
            app.renderer.resize(
                window.innerWidth,
                window.innerHeight
            )
            this.resize()
        })

        console.log(this)
    }

    resize() {
        this.rootX = this.app.screen.width / 2
        this.rootY = this.app.screen.height / 2
    }

    update(deltaTime) {
        let bounds = this.app.stage.getBounds()
        this.app.stage.filterArea = padBounds(bounds, STAGE_PADDING)
    }

    addLayer(layer) {
        this.app.stage.addChild(layer.graphics)
    }

    gridToLocal(pos) {
        return pos * this.size
    }

    localToGrid(pos) {
        return Math.round(pos / this.size) || 0
    }

    globalToLocalX(x) {
        return x - this.rootX
    }

    globalToLocalY(y) {
        return y - this.rootY
    }

    globalToGridX(x) {
        return this.localToGrid(this.globalToLocalX(x))
    }

    globalToGridY(y) {
        return this.localToGrid(this.globalToLocalY(y))
    }
}

export default Global
