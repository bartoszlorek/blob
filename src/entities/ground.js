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

function createGround(glob) {
    const mesh = new Mesh('ground', 0x26c6da)

    data.forEach(cell => mesh.blobs.add(
        new Blob(
            glob.gridToLocal(cell[0]),
            glob.gridToLocal(cell[1]),
            glob.size
        )
    ))

    return mesh
}

export default createGround
