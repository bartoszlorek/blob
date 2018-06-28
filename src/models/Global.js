class Global {
    constructor(app, size = 32) {
        this.app = app
        this.size = size
        this.time = 1/60
        this.update()

        window.addEventListener('resize', () => {
            app.renderer.resize(
                window.innerWidth,
                window.innerHeight
            )
            this.update()
        })
    }

    update() {
        this.rootX = this.app.screen.width / 2
        this.rootY = this.app.screen.height / 2

        // todo: optimize better fitting
        this.app.stage.filterArea = this.app.screen
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