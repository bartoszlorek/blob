function forEachMesh(meshes, iteratee) {
    let index = -1
    const length = meshes.length

    while (++index < length) {
        meshes[index].blobs.forEach(blob => {
            return iteratee(blob, index, meshes[index])
        })
    }
}

export default forEachMesh
