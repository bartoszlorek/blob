import app from './app'
import loader from './loader'
import state from './state/store'

//import Creator from './models/Creator'
import Global from './models/Global'
import Level from './models/Level'
import data from './levels/1-1.json'

loader.load((loader, assets) => {
    const global = new Global(app, state, 24)
    const level = new Level(data)
    global.mount(level)

    //const creator = new Creator(global, level)
    app.ticker.add(deltaFrame => {
        const deltaTime = global.time * deltaFrame

        level.update(deltaTime)
        level.render(global)
        //creator.render(global)
    })
})
