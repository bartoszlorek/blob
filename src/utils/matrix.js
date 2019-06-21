export function createMatrix(rows, cols) {
  const array = [];

  for (let x = 0; x < rows; x++) {
    array.push(new Array(cols));
  }
  return array;
}
