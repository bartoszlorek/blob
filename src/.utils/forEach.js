function forEach(array, iteratee) {
    let index = -1
    const length = array == null ? 0 : array.length

    while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
            return
        }
    }
}

export default forEach
