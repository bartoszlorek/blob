import Keyboard from '../models/Keyboard'
import Mesh from '../models/Mesh'
import Blob from '../models/Blob'

import Physics from '../traits/Physics'
import Move from '../traits/Move'
import Jump from '../traits/Jump'

function createPlayer(spec) {
    const mesh = new Mesh('player', 0xf44336)
    const blob = new Blob(0, -250, spec.radius * .75)
    mesh.blobs.add(blob)

    blob.addTrait(new Physics())
    blob.addTrait(new Move())
    blob.addTrait(new Jump())

    const input = new Keyboard()
    input.on('ArrowRight', state => {
        blob.move.dir += state ? 1 : -1
    })
    input.on('ArrowLeft', state => {
        blob.move.dir += state ? -1 : 1
    })
    input.on('Space', state => {
        if (state) {
            blob.jump.start()
        } else {
            blob.jump.cancel()
        }
    })

    return mesh
}

export default createPlayer
