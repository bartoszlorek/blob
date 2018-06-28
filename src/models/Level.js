import createPlayer from '../layers/player'
import createGround from '../layers/ground'
import createPrize from '../layers/prize'
import createBombs from '../layers/bombs'

class Level {
    constructor(global, data) {
        this.name = data.name
        this.global = global

        this.player = createPlayer(global, this, data['player'])
        this.ground = createGround(global, this, data['ground'])
        this.prize = createPrize(global, this, data['prize'])
        this.bombs = createBombs(global, this, data['bombs'])

        this.player.head.physics.addLayers(this.ground, this.bombs)

        global.addLayer(this.ground)
        global.addLayer(this.bombs)
        global.addLayer(this.prize)
        global.addLayer(this.player)

        console.log(this)
    }

    render(global) {
        this.player.render(global)
        this.ground.render(global)
        this.prize.render(global)
        this.bombs.render(global)
    }

    update(global) {
        this.player.update(global)
        this.bombs.update(global)
        this.prize.update(global)
    }
}

export default Level
