import { toOffsetX, toOffsetY } from './math'

function createSpec(app, radius = 32) {
    const spec = {
        rootX: app.screen.width / 2,
        rootY: app.screen.height / 2,
        offsetX: toOffsetX(radius),
        offsetY: toOffsetY(radius),
        gravity: {
            get x() {
                return spec.rootX
            },
            get y() {
                return spec.rootY
            },
            value: 0.25
        },
        radius
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
