import Trait from './Trait'

class Killable extends Trait {
    constructor() {
        super('killable')
    }

    obstruct(entity, edge, match) {
        if (match.mesh.name === 'bombs') {
            match.explosive.start(entity)
        }
    }
}

export default Killable
