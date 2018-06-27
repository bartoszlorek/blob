import { Application, filters } from 'pixi.js'
import { RGBSplitFilter } from '@pixi/filter-rgb-split'

const app = new Application({
    //antialias: true,
    //transparent: true,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x181b42
})

app.stage.filters = [
    new RGBSplitFilter([1, 0], [-1, 0], [0, 2]),
    new filters.BlurFilter(0.25)
]

document.body.appendChild(app.view)
export default app
