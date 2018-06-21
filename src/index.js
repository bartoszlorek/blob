import app from './app'
import createSpec from './.internal/spec'
import { fromGlobal, toGrid } from './.internal/math'

import Blob from './models/Blob'
import createPlayer from './entities/player'
import createGround from './entities/ground'

const spec = createSpec(app, 24)
const player = createPlayer(spec)
const ground = createGround(spec)
player.root.physics.add(ground)

app.stage.addChild(ground.shape)
app.stage.addChild(player.shape)

// app.renderer.view.addEventListener('click', e => {
//     let grid = toGrid(spec, fromGlobal(spec, e.offsetX, e.offsetY)),
//         blob = Blob.fromGrid(spec, Math.round(grid.x), Math.round(grid.y))
//     ground.blobs.add(blob)
//     console.log(ground.blobs)
// })

app.ticker.add(deltaTime => {
    // let global = app.renderer.plugins.interaction.mouse.global,
    //     local = fromGlobal(spec, global.x, global.y)
    // player.root.pos.set(local.x, local.y)

    // business logic
    player.update(deltaTime)

    // presentation logic
    ground.render(spec)
    player.render(spec)
})
