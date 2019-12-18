import {Container, TilingSprite} from 'pixi.js';
import {arrayForEach} from '@utils/array';

class Background {
  constructor() {
    this.sprite = new Container();
    this.layers = [];
    this.texHeight = 0;
  }

  set(texture, breaks = []) {
    this.texHeight = texture.height;
    this.sprite.removeChildren();

    this.layers = [0, ...breaks].map((position, index, points) => {
      const tile = new TilingSprite(texture);
      const height = (points[index + 1] || this.texHeight) - position;
      const percent = height / this.texHeight;

      this.sprite.addChild(tile);

      return {
        tile,
        height,
        position,
        percent
      };
    });
  }

  resize() {
    if (!this.layers.length) {
      return;
    }
    const {innerWidth, innerHeight} = window;
    const difference = this.texHeight - innerHeight;

    let offset = 0;

    if (difference > 0) {
      // accordion layers distribution
      arrayForEach(this.layers, layer => {
        const {tile, position, height, percent} = layer;

        tile.visible = true;
        tile.width = innerWidth;
        tile.height = height;

        tile.position.y = position + offset;
        tile.tilePosition.y = -position;
        tile.tileScale.y = 1;

        offset -= difference * percent;
      });
    } else {
      // just scale to fit first layer and hide other
      arrayForEach(this.layers, ({tile}, index) => {
        if (index === 0) {
          tile.visible = true;
          tile.width = innerWidth;
          tile.height = innerHeight;

          tile.position.y = 0;
          tile.tilePosition.y = 0;
          tile.tileScale.y = innerHeight / this.texHeight;
        } else {
          tile.visible = false;
        }
      });
    }
  }
}

export default Background;
