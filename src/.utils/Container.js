class Container {
    constructor(items) {
        this.items = items != null ? items.slice() : []
    }

    get length() {
        return this.items.length
    }

    add(item) {
        let index = this.items.indexOf(item)
        if (index === -1) {
            this.items.push(item)
        }
    }

    remove(item) {
        let index = this.items.indexOf(item)
        if (index !== -1) {
            this.items.splice(index, 1)
        }
    }

    empty() {
        this.items = []
    }

    forEach(iteratee) {
        let index = -1
        const length = this.items.length
        while (++index < length) {
            if (iteratee(this.items[index], index, this.items) === false) {
                return
            }
        }
    }
}

export default Container
