// from pythagorean theorem
export const toOffsetX = radius => {
    return Math.sqrt(Math.pow(radius * 2, 2) - Math.pow(radius, 2))
}
export const toOffsetY = radius => radius
export const toOffset = radius => ({
    x: toOffsetX(radius),
    y: radius
})

export const toGridX = (spec, x) => x / spec.offsetX
export const toGridY = (spec, y) => y / spec.offsetY
export const toGrid = (spec, x, y) => {
    if (y === undefined) {
        return {
            x: toGridX(spec, x.x),
            y: toGridY(spec, x.y)
        }
    } else {
        return {
            x: toGridX(spec, x),
            y: toGridY(spec, y)
        }
    }
}

export const fromGridX = (spec, x) => x * spec.offsetX
export const fromGridY = (spec, y) => y * spec.offsetY
export const fromGrid = (spec, x, y) => {
    if (y === undefined) {
        return {
            x: fromGridX(spec, x.x),
            y: fromGridY(spec, x.y)
        }
    } else {
        return {
            x: fromGridX(spec, x),
            y: fromGridY(spec, y)
        }
    }
}

export const fromGlobalX = (spec, x) => x - spec.rootX
export const fromGlobalY = (spec, y) => y - spec.rootY
export const fromGlobal = (spec, x, y) => {
    if (y === undefined) {
        return {
            x: fromGlobalX(spec, x.x),
            y: fromGlobalY(spec, x.y)
        }
    } else {
        return {
            x: fromGlobalX(spec, x),
            y: fromGlobalY(spec, y)
        }
    }
}
