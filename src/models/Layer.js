import { Graphics } from 'pixi.js'

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
            this.graphics.drawRect(
                global.rootX + entity.left,
                global.rootY + entity.top,
                entity.size,
                entity.size
            )
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
        let index = -1
        const length = this.children.length
        while (++index < length) {
            if (iteratee(this.children[index], index, this) === false) {
                return
            }
        }
    }
}

export default Layer
