import app from './app'

import Global from './models/Global'
//import Creator from './models/Creator'
import Level from './models/Level'

import data1_1 from './levels/1-1.json'
import createPlayer from './entities/player'

const global = new Global(app, 24)
const level = new Level(global, data1_1)
//const creator = new Creator(global, level)

const player = createPlayer(global)
player.head.physics.addLayers(...level.solids)
global.addLayer(player)

app.ticker.add(deltaFrame => {
    const deltaTime = global.time * deltaFrame

    // business logic
    level.update(deltaTime)
    player.update(deltaTime)

    // presentation logic
    level.render(global)
    player.render(global)

    //creator.render(global)
})
