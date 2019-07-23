import {Container, TilingSprite} from 'pixi.js';

class Background {
  constructor() {
    this.sprite = new Container();
  }

  set(texture) {
    if (this.sprite.children.length) {
      this.sprite.removeChildAt(0);
    }
    // todo: handle multiple layers of background
    this.sprite.addChild(new TilingSprite(texture));
  }

  resize() {
    if (!this.sprite.children.length) {
      return;
    }
    const {innerWidth, innerHeight} = window;
    const child = this.sprite.getChildAt(0);

    child.width = innerWidth;
    child.height = innerHeight;
    child.tileScale.y = innerHeight / child.texture.height;
  }
}

export default Background;
