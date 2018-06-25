import { Graphics } from 'pixi.js'

class Creator {
    constructor(glob, level) {
        this.glob = glob
        this.level = level
        this.interaction = glob.app.renderer.plugins.interaction

        this.pointer = new Graphics()
        this.pointer.lineStyle(1, 0x000000)
        this.pointer.drawRect(0, 0, glob.size, glob.size)

        glob.app.stage.addChild(this.pointer)
        glob.app.renderer.view.addEventListener('click', e => {
            let x = glob.globalToGridX(e.offsetX),
                y = glob.globalToGridY(e.offsetY)
            console.log(x, y)
        })
    }

    render(glob) {
        let pos = this.interaction.mouse.global,
            x = glob.globalToGridX(pos.x),
            y = glob.globalToGridY(pos.y)

        this.pointer.position.set(
            glob.rootX + glob.gridToLocal(x) - glob.size / 2,
            glob.rootY + glob.gridToLocal(y) - glob.size / 2
        )
    }
}

export default Creator
