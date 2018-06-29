import { Graphics } from 'pixi.js'
import forEach from '../.utils/forEach'

class Layer {
    constructor(name, color = 0xe6e6e6) {
        this.name = name
        this.color = color

        this.graphics = new Graphics()
        this.children = []
    }

    get head() {
        return this.children[0]
    }

    clear() {
        this.graphics.clear()
        this.graphics.beginFill(this.color)
        //this.graphics.lineStyle(1, 0xffffff)
    }

    render(global) {
        this.clear()
        this.forEach(entity => {
            if (entity.visible) {
                this.graphics.drawRect(
                    global.rootX + entity.left,
                    global.rootY + entity.top,
                    entity.size,
                    entity.size
                )
            }
        })
    }

    update(deltaTime) {
        this.forEach(entity => {
            entity.update(deltaTime)
        })
    }

    append(entity) {
        if (entity.parent === this) {
            return
        }
        if (entity.parent !== null) {
            entity.parent.remove(entity)
        }
        this.children.push(entity)
        entity.parent = this
    }

    remove(entity) {
        if (entity.parent !== this) {
            return
        }
        let index = this.children.indexOf(entity)
        if (index !== -1) {
            this.children.splice(index, 1)
            entity.parent = null
        }
    }

    forEach(iteratee) {
        forEach(this.children, iteratee)
    }
}

export default Layer
