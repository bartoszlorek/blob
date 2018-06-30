import { extras } from 'pixi.js'

class Background {
    constructor(texture) {
        this.sprite = new extras.TilingSprite(texture)
    }

    resize(global) {
        console.log(this)

        // const bg = this.background.children[0]
        // bg.width = this.app.screen.width
        // bg.height = this.app.screen.height
        // bg.tileScale.y = this.app.screen.height / bg.texture.height
    }
}

export default Background
