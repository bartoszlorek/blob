import {arrayForEach} from '@utils/array';
import {matrixForEach} from '@utils/matrix';

class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.entries = [];

    for (let x = 0; x < rows; x++) {
      this.entries.push(new Array(cols));
    }
  }

  merge(...matrices) {
    arrayForEach(matrices, matrix => {
      matrix.forEach((value, x, y) => {
        if (value !== undefined) {
          this.entries[x][y] = value;
        }
      });
    });
  }

  forEach(iteratee) {
    matrixForEach(this.entries, iteratee);
  }
}

export default Matrix;
