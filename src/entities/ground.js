import Mesh from '../models/Mesh'
import Blob from '../models/Blob'

function createGround(spec) {
    const mesh = new Mesh('ground', 0x26c6da)
    mesh.blobs.add(Blob.fromGrid(spec, 0, 0))
    mesh.blobs.add(Blob.fromGrid(spec, 1, -1))
    mesh.blobs.add(Blob.fromGrid(spec, -1, -1))
    mesh.blobs.add(Blob.fromGrid(spec, -2, 0))
    mesh.blobs.add(Blob.fromGrid(spec, -3, -1))
    mesh.blobs.add(Blob.fromGrid(spec, -4, 0))
    mesh.blobs.add(Blob.fromGrid(spec, 1, -3))
    mesh.blobs.add(Blob.fromGrid(spec, 1, -5))
    mesh.blobs.add(Blob.fromGrid(spec, 1, -7))
    mesh.blobs.add(Blob.fromGrid(spec, 1, -9))
    return mesh
}

export default createGround
