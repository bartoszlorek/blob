// from pythagorean theorem
export const toOffset = radius => ({
    x: Math.sqrt(Math.pow(radius * 2, 2) - Math.pow(radius, 2)),
    y: radius
})

export const toGrid = (spec, x, y) => ({
    x: (x - spec.rootX) / spec.offsetX,
    y: (y - spec.rootY) / spec.offsetY
})
