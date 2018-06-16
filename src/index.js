import app from './app'
import createSpec from './.internal/spec'
import { toGrid } from './.internal/transform'

import Blob from './models/Blob'
import Mesh from './models/Mesh'

const spec = createSpec(app)
const ground = new Mesh('ground', 0x26c6da)
const player = new Mesh('player', 0xf44336)
const pointer = new Blob(0, 0)
player.blobs.add(pointer)

app.stage.addChild(ground.shape)
app.stage.addChild(player.shape)
ground.blobs.add(new Blob(0, 0))
ground.blobs.add(new Blob(1, -1))

app.renderer.view.addEventListener('click', e => {
    let blob = Blob.fromObject(toGrid(spec, e.offsetX, e.offsetY))
    blob.set(Math.round(blob.x), Math.round(blob.y))
    ground.blobs.add(blob)
})

app.ticker.add(() => {
    let pos = app.renderer.plugins.interaction.mouse.global
    pointer.setFromObject(toGrid(spec, pos.x, pos.y))

    let inter = ground.intersection(pointer)
    if (inter) {
        console.log(inter)
    }
    ground.render(spec)
    player.render(spec)
})
