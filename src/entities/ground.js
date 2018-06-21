import Mesh from '../models/Mesh'
import Blob from '../models/Blob'

const data = [
    [-1, -2],
    [0, -2],
    [1, -2],

    [-1, -1],
    [0, -1],
    [1, -1],

    [-2, 0],
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 0],
    [4, 0],

    [-2, 1],
    [-1, 1],
    [0, 1],
    [1, 1],
    [3, 1],
    [4, 1],
    [5, 1],

    [-1, 2]
]

const fromGridX = (spec, x) => x * spec.size - spec.size / 2
const fromGridY = (spec, y) => y * spec.size - spec.size / 2

function createGround(spec) {
    const mesh = new Mesh('ground', 0x26c6da)

    data.forEach(cell => mesh.blobs.add(
        new Blob(
            fromGridX(spec, cell[0]),
            fromGridY(spec, cell[1]),
            spec.size
        )
    ))

    return mesh
}

export default createGround
