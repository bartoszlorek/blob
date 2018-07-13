import Grid from '../.utils/Grid'

const randomRange = (min, max) => Math.floor(Math.random() * max) + min

class MapGenerator {
    constructor(global, cols = 10, rows = 10) {
        this.global = global
        this.grid = new Grid(cols, rows)
        this.birthLimit = 1
        this.deathLimit = 2

        console.log(this)
    }

    generate(simulationSteps, initialPoints) {
        const xOffset = Math.round(this.grid.cols / 2)
        const yOffset = Math.round(this.grid.rows / 2)

        this.grid.fill(0)
        initialPoints.forEach(point => (
            this.grid.cells[xOffset - point[0]][yOffset - point[1]] = 1
        ))

        let index = -1
        while (++index < simulationSteps) {
            this.doSimulationStep()
        }

        return this.grid.toArray()
            .filter(cell => cell.data)
            .map(cell => [xOffset - cell.x, yOffset - cell.y])
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

    doSimulationStep() {
        const nextGrid = this.grid.clone()

        this.grid.forEach((cell, x, y) => {
            const livingNeighbours = this.grid
                .neighbours(x, y, true)
                .reduce((sum, val) => sum + val, 0)

            if (livingNeighbours >= 1) {
                nextGrid.cells[x][y] = 1
            }
        })

        this.grid = nextGrid
        return this
    }
}

export default MapGenerator
