import {Container, TilingSprite} from 'pixi.js';

class Background {
  constructor(spriteset) {
    const {tilesize, background} = spriteset;
    this.tilesize = tilesize;
    this.graphics = new Container();
    this.fragments = [];

    this.initialize(background.edges, background.texture);
  }

  initialize(edges, texture) {
    this.fragments = [0, ...edges].map((topEdge, index, edges) => {
      const base = new TilingSprite(texture);
      const fill = new TilingSprite(texture);
      this.graphics.addChild(base);
      this.graphics.addChild(fill);

      const top = topEdge * texture.height;
      const bottomEdge = edges[index + 1] || 1;
      const bottom = bottomEdge * texture.height;

      return {
        base,
        fill,
        top,
        topEdge,
        bottom,
        bottomEdge,
        height: bottom - top,
      };
    });
  }

  resize() {
    const {innerWidth, innerHeight} = window;
    const tilesize = this.tilesize;

    for (let i = 0; i < this.fragments.length; i++) {
      const {
        base,
        fill,
        topEdge,
        top,
        bottomEdge,
        bottom,
        height,
      } = this.fragments[i];

      const curr = Math.round((topEdge * innerHeight) / tilesize) * tilesize;
      const next = Math.round((bottomEdge * innerHeight) / tilesize) * tilesize;
      const diff = next - curr;

      base.width = innerWidth;
      base.height = height;
      base.tilePosition.y = -top;
      base.y = curr;

      if (diff > height) {
        const fillHeight = diff - height;

        fill.visible = true;
        fill.width = innerWidth;
        fill.height = fillHeight;
        fill.tilePosition.y = -(bottom - fillHeight);
        fill.y = next - fillHeight;
      } else {
        fill.visible = false;
      }
    }
  }
}

export default Background;
