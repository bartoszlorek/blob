import { Container, filters, loader, extras } from 'pixi.js'
import { RGBSplitFilter } from '@pixi/filter-rgb-split'
import padBounds from '../.utils/padBounds'

import ForceFields from '../models/ForceFields'
import Background from '../models/Background'

import createBombs from '../layers/bombs'
import createEffects from '../layers/effects'
import createGround from '../layers/ground'
import createPlayer from '../layers/player'
import createPrize from '../layers/prize'

const STAGE_PADDING = 10

const LAYER_FACTORIES = [
    createGround,
    createBombs,
    createPrize,
    createEffects,
    createPlayer
]

class Level {
    constructor(data) {
        this.name = data.name
        this.data = data
        this.global = null
        this.forces = new ForceFields()
        this.solids = []

        this._foreground = new Container()
        this._background = new Container()
        this._container = new Container()
        this._container.addChild(this._background)
        this._container.addChild(this._foreground)

        this._foreground.filters = [
            new RGBSplitFilter([1, 0], [-1, 0], [0, 2]),
            new filters.BlurFilter(0.25)
        ]

        // todo: better background handling
        const gradient = new extras.TilingSprite(loader.resources.space.texture)
        this._background.addChild(gradient)
    }

    onMount(global) {
        this.create()
        this.fitBackground()
        this.forces.radius = global.size
        this.forces.calculate(this.solids)

        global.over$.subscribe(() => {
            this.clear()
            this.create()
        })
        global.resize$.subscribe(() => {
            this.fitBackground()
        })
    }

    onUnmount(global) {
        this.clear()
    }

    create() {
        LAYER_FACTORIES.forEach(factory => {
            const layer = factory(this.data, this.global, this)
            this._foreground.addChild(layer.graphics)
            this[layer.name] = layer
            layer.level = this

            if (layer.solid) {
                this.solids.push(layer)
            }
        })
    }

    update(deltaTime) {
        this.fitForegroundArea()
        this.bombs.update(deltaTime)
        this.effects.update(deltaTime)
        this.player.update(deltaTime)
        this.prize.update(deltaTime)
    }

    render(global) {
        this.bombs.render(global)
        this.effects.render(global)
        this.ground.render(global)
        this.player.render(global)
        this.prize.render(global)
    }

    clear() {
        while (this._foreground.children[0]) {
            this._foreground.removeChild(this._foreground.children[0])
        }
    }

    fitForegroundArea() {
        let bounds = this._foreground.getBounds()
        this._foreground.filterArea = padBounds(bounds, STAGE_PADDING)
    }

    fitBackground() {
        const { screen } = this.global.app
        this._background.children.forEach(sprite => {
            sprite.width = screen.width
            sprite.height = screen.height
            sprite.tileScale.y = screen.height / sprite.texture.height
        })
    }
}

export default Level
