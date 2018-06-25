import app from './app'

import Global from './models/Global'
import Helper from './models/Helper'
import Blob from './models/Blob'
import createPlayer from './entities/player'
import createGround from './entities/ground'

const glob = new Global(app, 24)
const player = createPlayer(glob)
const ground = createGround(glob)
player.root.physics.add(ground)

app.stage.addChild(ground.shape)
app.stage.addChild(player.shape)

// app.renderer.view.addEventListener('click', e => {
//     let grid = toGrid(glob, fromGlobal(glob, e.offsetX, e.offsetY)),
//         blob = Blob.fromGrid(glob, Math.round(grid.x), Math.round(grid.y))
//     ground.blobs.add(blob)
//     console.log(ground.blobs)
// })

app.ticker.add(deltaFrame => {
    const deltaTime = glob.time * deltaFrame

    // let global = app.renderer.plugins.interaction.mouse.global,
    //     local = fromGlobal(glob, global.x, global.y)
    // player.root.pos.set(local.x, local.y)

    // business logic
    player.update(deltaTime)

    // presentation logic
    ground.render(glob)
    player.render(glob)
})
