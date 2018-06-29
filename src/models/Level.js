import { GlowFilter } from '@pixi/filter-glow'
import Layer from '../models/Layer'

import createPlayer from '../layers/player'
import createGround from '../layers/ground'
import createPrize from '../layers/prize'
import createBombs from '../layers/bombs'

const EFFECT_COLOR = 0xffffff

class Level {
    constructor(global, data) {
        this.name = data.name
        this.data = data
        this.global = global
        this.initialize()
    }

    initialize() {
        this.effect = new Layer('effect', EFFECT_COLOR)
        this.player = createPlayer(this.global, this, this.data['player'])
        this.ground = createGround(this.global, this, this.data['ground'])
        this.prize = createPrize(this.global, this, this.data['prize'])
        this.bombs = createBombs(this.global, this, this.data['bombs'])

        this.player.head.physics.addLayers(this.ground, this.bombs)
        this.effect.graphics.filters = [new GlowFilter(15, 1, 0, EFFECT_COLOR)]

        this.global.addLayer(this.ground)
        this.global.addLayer(this.bombs)
        this.global.addLayer(this.prize)
        this.global.addLayer(this.effect)
        this.global.addLayer(this.player)

        console.log(this)
    }

    gameOver() {
        this.global.clearLayers()
        this.initialize()
    }

    render(global) {
        this.player.render(global)
        this.ground.render(global)
        this.prize.render(global)
        this.bombs.render(global)
        this.effect.render(global)
    }

    update(deltaTime) {
        this.player.update(deltaTime)
        //this.ground.update(deltaTime)
        this.prize.update(deltaTime)
        this.bombs.update(deltaTime)
        this.effect.update(deltaTime)
    }
}

export default Level
