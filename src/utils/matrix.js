export function matrixForEach(matrix, iteratee) {
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      if (iteratee(matrix[x][y], x, y) === false) {
        return;
      }
    }
  }
}
