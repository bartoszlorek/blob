class Grid {
    constructor(cols = 10, rows = 10, value) {
        this.cols = cols
        this.rows = rows
        this.cells = []
        this.fill(value)
    }

    fill(value) {
        this.cells = []
        const type = typeof value

        if (type === 'undefined') {
            value = 0
        }
        for (let x = 0; x < this.cols; x++) {
            this.cells[x] = []
            for (let y = 0; y < this.rows; y++) {
                this.cells[x][y] = type === 'function' ? value(x, y) : value
            }
        }
    }

    contains(x, y) {
        return x >= 0 && x < this.cols
            && y >= 0 && y < this.rows
    }

    neighbours(x, y) {
        let result = []
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (!(i === x && j === y) && this.contains(i, j)) {
                    result.push(this.cells[i][j])
                }
            }
        }
        return result
    }

    forEach(iteratee) {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                if (iteratee(this.cells[x][y], x, y, this.cells) === false) {
                    return
                }
            }
        }
    }

    toArray() {
        let result = []
        this.forEach((data, x, y) => (
            result.push({ data, x, y })
        ))
        return result
    }
}

export default Grid
