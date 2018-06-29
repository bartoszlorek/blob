import { loader, extras, Container, filters } from 'pixi.js'
import { RGBSplitFilter } from '@pixi/filter-rgb-split'

import padBounds from '../.utils/padBounds'

const STAGE_PADDING = 10

class Global {
    constructor(app, size = 32) {
        this.app = app
        this.size = size
        this.time = 1/60

        this.background = new Container()
        this.foreground = new Container()
        this.foreground.filters = [
            new RGBSplitFilter([1, 0], [-1, 0], [0, 2]),
            new filters.BlurFilter(0.25)
        ]
        this.background.addChild(new extras.TilingSprite(
            loader.resources.space.texture
        ))

        app.stage.addChild(this.background)
        app.stage.addChild(this.foreground)

        window.addEventListener('resize', () => {
            app.renderer.resize(
                window.innerWidth,
                window.innerHeight
            )
            this.resize()
        })

        this.resize()
        this.update()
    }

    resize() {
        this.rootX = this.app.screen.width / 2
        this.rootY = this.app.screen.height / 2

        // fit background image
        const bg = this.background.children[0]
        bg.width = this.app.screen.width
        bg.height = this.app.screen.height
        bg.tileScale.y = this.app.screen.height / bg.texture.height
    }

    update(deltaTime) {
        let bounds = this.foreground.getBounds()
        this.foreground.filterArea = padBounds(bounds, STAGE_PADDING)
    }

    addLayer(layer) {
        this.foreground.addChild(layer.graphics)
    }

    clearLayers() {
        while (this.foreground.children[0]) {
            this.foreground.removeChild(this.foreground.children[0])
        }
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
