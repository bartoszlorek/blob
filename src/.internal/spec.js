import { toOffsetX, toOffsetY } from './math'
import Vector from '../.utils/Vector'

function createSpec(app, size = 32) {
    const spec = {
        rootX: app.screen.width / 2,
        rootY: app.screen.height / 2,
        gravityCenter: new Vector(0, 0),
        gravityValue: .4,
        size
    }

    window.addEventListener('resize', () => {
        app.renderer.resize(
            window.innerWidth,
            window.innerHeight
        )
        spec.rootX = app.screen.width / 2
        spec.rootY = app.screen.height / 2
    })

    return spec
}

export default createSpec
