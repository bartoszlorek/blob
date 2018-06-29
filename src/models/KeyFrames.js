// frame: [frameTime, callback]

class KeyFrames {
    constructor(name, frames = [], loop = false) {
        this.name = name
        this.frames = frames
        this.loop = loop
        this.stop()
    }

    load() {
        this.frameIndex = -1
        this.frameTime = 0
        this.time = 0
    }

    play() {
        this.playing = true
    }

    pause() {
        this.playing = false
    }

    stop() {
        this.load()
        this.pause()
    }

    nextFrame() {
        if (++this.frameIndex < this.frames.length) {
            this.frameTime = this.frames[this.frameIndex][0]
        } else if (this.loop) {
            this.load()
        } else {
            this.stop()
        }
    }

    update(deltaTime) {
        if (this.frameIndex < 0) {
            this.nextFrame()
        }
        if (this.time >= this.frameTime) {
            this.frames[this.frameIndex][1](this.frameIndex, deltaTime)
            this.nextFrame()
        }
        this.time += deltaTime
    }
}

export default KeyFrames
