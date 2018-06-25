import Mesh from './Mesh'
import Blob from './Blob'

import Shine from '../traits/Shine'
import Explosive from '../traits/Explosive'

const GROUND_COLOR = 0xd1d8db
const ENEMY_COLOR = 0xf44336
const BOMBS_COLOR = 0x333333
const PRIZE_COLOR = 0xdabc27

class Level {
    constructor(glob, data) {
        this.glob = glob

        this.ground = new Mesh('ground', GROUND_COLOR)
        this.bombs = new Mesh('bombs', BOMBS_COLOR)
        this.prize = new Mesh('prize', PRIZE_COLOR)

        data.ground.forEach(this.fromData(this.ground))
        data.bombs.forEach(this.fromData(this.bombs))
        data.prize.forEach(this.fromData(this.prize))

        glob.app.stage.addChild(this.ground.shape)
        glob.app.stage.addChild(this.bombs.shape)
        glob.app.stage.addChild(this.prize.shape)

        // traits
        this.prize.root.addTrait(new Shine(glob.size))
        this.bombs.forEachBlob(blob => {
            blob.addTrait(new Explosive(this))
        })

        console.log(this)
    }

    get solids() {
        return [this.ground, this.bombs]
    }

    fromData(mesh) {
        return pos => mesh.addBlob(new Blob(
            this.glob.gridToLocal(pos[0]),
            this.glob.gridToLocal(pos[1]),
            this.glob.size
        ))
    }

    render(glob) {
        this.ground.render(glob)
        this.bombs.render(glob)
        this.prize.render(glob)
    }

    update(glob) {
        this.prize.update(glob)
        this.bombs.update(glob)
    }
}

export default Level
