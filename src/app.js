import { Application } from 'pixi.js'

const app = new Application({
    //antialias: true,
    //transparent: true,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xf2f2f2
})

document.body.appendChild(app.view)

export default app
