import { loader } from 'pixi.js'

class Sound {
    constructor(...names) {
        this.names = names
        this.index = -1
    }

    play(index = 0) {
        let resource = loader.resources[this.names[index]]
        if (resource !== undefined) {
            resource.data.load()
            resource.data.play()
        }
    }

    playRandom() {
        this.play(this.randomIndex())
    }

    playSequence() {
        this.play(this.nextIndex())
    }

    nextIndex() {
        return (this.index = ++this.index % this.names.length)
    }

    randomIndex() {
        const prevIndex = this.index
        this.index = Math.floor(Math.random() * this.names.length)
        return this.index === prevIndex ? this.nextIndex() : this.index
    }
}

export default Sound
