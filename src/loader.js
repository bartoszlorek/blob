import { loader } from 'pixi.js'

export default loader
    .add([
        // graphics
        { name: 'gradient', url: 'assets/gradient.png' },

        // sounds
        //{ name: 'music', url: 'assets/music.mp3' },
        { name: 'jump', url: 'assets/jump2.mp3' },
        { name: 'blop', url: 'assets/blop.mp3' }
    ])
    .on('complete', (loader, assets) => {
        assets.jump.data.volume = 0.25
        assets.blop.data.volume = 0.15

        //assets.music.data.loop = true
        //assets.music.data.volume = 0.1
        //assets.music.data.play()
    })
