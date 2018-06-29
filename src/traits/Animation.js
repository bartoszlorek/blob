import KeyFrames from '../models/KeyFrames'
import Trait from './Trait'

class Animation extends Trait {
    constructor() {
        super('animation')
        this.keyframes = []
    }

    add(name, frames = [], loop = false) {
        this.keyframes.push(new KeyFrames(name, frames, loop))
        return this
    }

    play(name) {
        let keyframe = this.keyframes.filter(a => a.name === name)
        if (keyframe[0] !== undefined) {
            keyframe[0].play()
        }
        return this
    }

    update(entity, deltaTime) {
        let index = -1
        const length = this.keyframes.length
        while (++index < length) {
            if (this.keyframes[index].playing) {
                this.keyframes[index].update(deltaTime)
            }
        }
    }
}

export default Animation
