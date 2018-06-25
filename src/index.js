import app from './app'

import Global from './models/Global'
import Creator from './models/Creator'
import Level from './models/Level'

import data1_1 from './levels/1-1.json'
import createPlayer from './entities/player'

const glob = new Global(app, 24)
const level = new Level(glob, data1_1)
//const creator = new Creator(glob, level)

const player = createPlayer(glob)
player.root.physics.addSolid(...level.solids)

app.stage.addChild(player.shape)
app.ticker.add(deltaFrame => {
    const deltaTime = glob.time * deltaFrame

    // business logic
    level.update(deltaTime)
    player.update(deltaTime)

    // presentation logic
    level.render(glob)
    player.render(glob)

    //creator.render(glob)
})
