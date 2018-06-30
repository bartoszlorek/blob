import { fromEvent, Subject } from 'rxjs'

class Global {
    constructor(app, size = 32) {
        this.app = app
        this.size = size
        this.time = 1 / 60
        this.level = null

        this.start$ = new Subject()
        this.over$ = new Subject()
        this.start$.emit = () => this.start$.next(this)
        this.over$.emit = () => this.over$.next(this)

        this.resize$ = fromEvent(window, 'resize')
        this.resize$.subscribe(() => this.resize())
        this.resize()

        console.log(this)
    }

    resize() {
        this.app.renderer.resize(window.innerWidth, window.innerHeight)
        this.rootX = this.app.screen.width / 2
        this.rootY = this.app.screen.height / 2
    }

    mount(level) {
        if (this.level !== null) {
            this.unmount()
        }
        this.app.stage.addChild(level._container)
        this.level = level
        level.global = this
        level.onMount(this)
    }

    unmount() {
        this.app.stage.removeChild(this.level)
        this.level.onUnmount(this)
        this.level.global = null
        this.level = null
    }

    gridToLocal(pos) {
        return pos * this.size
    }

    localToGrid(pos) {
        return Math.round(pos / this.size) || 0
    }

    globalToLocalX(x) {
        return x - this.rootX
    }

    globalToLocalY(y) {
        return y - this.rootY
    }

    globalToGridX(x) {
        return this.localToGrid(this.globalToLocalX(x))
    }

    globalToGridY(y) {
        return this.localToGrid(this.globalToLocalY(y))
    }
}

export default Global
