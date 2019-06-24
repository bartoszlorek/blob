import {arrayForEach} from '@utils/array';
import {objectForEach} from '@utils/object';

class Matrix {
  constructor(cols = 3, rows = 3) {
    this.cols = cols;
    this.rows = rows;
    this.entries = [];
  }

  _index(col, row) {
    return row * this.rows + col;
  }

  set(col, row, value) {
    this.entries[this._index(col, row)] = value;
  }

  n(col, row) {
    return this.entries[this._index(col, row)];
  }

  merge(...matrix) {
    arrayForEach(matrix, mat => {
      objectForEach(mat.entries, (value, index) => {
        this.entries[index] = value;
      });
    });
  }
}

export default Matrix;
