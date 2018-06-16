import { Application } from 'pixi.js'

const app = new Application({
    antialias: true,
    transparent: true,
    autoResize: true
})

document.body.appendChild(app.view)

export default app
