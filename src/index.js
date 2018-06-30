import { loader } from 'pixi.js'
import app from './app'

//import Creator from './models/Creator'
import Global from './models/Global'
import Level from './models/Level'

import data from './levels/1-1.json'

loader
    .add([{ name: 'space', url: 'images/space.png' }])
    .on('complete', initialize)
    .load()

function initialize() {
    const global = new Global(app, 24)
    const level = new Level(data)
    global.mount(level)

    //const creator = new Creator(global, level)

    app.ticker.add(deltaFrame => {
        const deltaTime = global.time * deltaFrame

        level.update(deltaTime)
        level.render(global)
        //creator.render(global)
    })
}
