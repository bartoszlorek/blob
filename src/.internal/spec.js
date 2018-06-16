import { toOffset } from './transform'

const createSpec = (app, radius = 32) => ({
    rootX: app.screen.width / 2,
    rootY: app.screen.height / 2,
    offsetX: toOffset(radius).x,
    offsetY: toOffset(radius).y,
    radius
})

export default createSpec
