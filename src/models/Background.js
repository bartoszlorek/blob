import {Container, TilingSprite} from 'pixi.js';
import {arrayForEach} from '@utils/array';

class Background {
  constructor() {
    this.sprite = new Container();
    this.layers = [];
  }

  set(texture, breakpoints = []) {
    this.sprite.removeChildren();
    this.layers = [0, ...breakpoints].map((from, index, points) => {
      const tile = new TilingSprite(texture);
      this.sprite.addChild(tile);

      return {
        tile,
        from,
        to: points[index + 1] || texture.height
      };
    });
  }

  resize() {
    const {length} = this.layers;

    if (!length) {
      return;
    }
    const {innerWidth, innerHeight} = window;
    const height = this.layers[length - 1].to;
    const offset = (innerHeight - height) / (length - 1);

    if (offset < 0) {
      // accordion distribution
      arrayForEach(this.layers, (layer, index) => {
        const {tile, from, to} = layer;

        tile.visible = true;
        tile.width = innerWidth;
        tile.height = to - from;

        tile.tilePosition.y = -from;
        tile.tileScale.y = 1;

        if (index > 0) {
          tile.position.y = from + offset;
        }
      });
    } else {
      // scale vertically first layer and hide other
      arrayForEach(this.layers, (layer, index) => {
        const {tile} = layer;

        if (index > 0) {
          tile.visible = false;
        } else {
          tile.visible = true;
          tile.width = innerWidth;
          tile.height = innerHeight;

          tile.tilePosition.y = 0;
          tile.tileScale.y = innerHeight / height;
        }
      });
    }
  }
}

export default Background;
