import { GlowFilter } from '@pixi/filter-glow'
import Layer from './Layer'
import Entity from './Entity'

import Shine from '../traits/Shine'
import Explosive from '../traits/Explosive'

const GROUND_COLOR = 0xdb1278
const ENEMY_COLOR = 0xf44336
const BOMBS_COLOR = 0x0b46a4
const PRIZE_COLOR = 0xf7dd2c

class Level {
    constructor(global, data) {
        this.name = data.name
        this.global = global

        this.ground = new Layer('ground', GROUND_COLOR)
        this.bombs = new Layer('bombs', BOMBS_COLOR)
        this.prize = new Layer('prize', PRIZE_COLOR)
        this.prize.graphics.filters = [new GlowFilter(10, 1, 0, PRIZE_COLOR)]

        this.createFromData(data, 'ground')
        this.createFromData(data, 'bombs')
        this.createFromData(data, 'prize')

        global.addLayer(this.ground)
        global.addLayer(this.bombs)
        global.addLayer(this.prize)

        // traits
        this.prize.head.addTrait(new Shine(global.size))
        this.bombs.forEach(entity => entity.addTrait(new Explosive(this)))

        console.log(this)
    }

    get solids() {
        return [this.ground, this.bombs]
    }

    createFromData(data, layerName) {
        data[layerName].forEach(pos => {
            this[layerName].append(new Entity(
                this.global.gridToLocal(pos[0]),
                this.global.gridToLocal(pos[1]),
                this.global.size
            ))
        })
    }

    render(global) {
        this.ground.render(global)
        this.bombs.render(global)
        this.prize.render(global)
    }

    update(global) {
        this.bombs.update(global)
        this.prize.update(global)
    }
}

export default Level
