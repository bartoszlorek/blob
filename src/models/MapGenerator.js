import Grid from '../.utils/Grid'

const randomRange = (min, max) => Math.floor(Math.random() * max) + min

class MapGenerator {
    constructor(global, cols = 10, rows = 10) {
        this.global = global
        this.grid = new Grid(cols, rows)
        console.log(this)
    }

    getInitialPoints(amount) {
        if (!amount) {
            return []
        }
        const buffer = {}
        const result = []

        while (amount) {
            let x = randomRange(0, this.grid.cols),
                y = randomRange(0, this.grid.rows),
                signature = x + '-' + y

            if (buffer[signature] === undefined) {
                buffer[signature] = true
                result.push({ x, y })
                amount -= 1
            }
        }
        return result
    }
}

export default MapGenerator
