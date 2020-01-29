import Spritesheet from './Spritesheet';

class Spriteset {
  constructor(json, resources) {
    this.spritesheet = this._parseSpritesheet(
      json.tilesets,
      json.tilewidth,
      resources
    );

    this.layers = this._parseLayers(json.layers);
  }

  _parseLayers(rawLayers) {
    const layers = {};

    rawLayers.forEach(layer => {
      const {name, data, width, properties} = layer;

      if (this._isTypeSprite(properties)) {
        layers[name] = {
          sprites: this._parseSprite(data, width),
        };
      } else {
        layers[name] = {
          tilemap: this._parseTiles(data),
          offset: [0, 0],
          width,
        };
      }
    });

    return layers;
  }

  _parseSprite(data, width) {
    const sprites = [];

    for (let index = 0; index < data.length; index++) {
      const id = data[index];

      if (id > 0) {
        sprites.push({
          id,
          position: this._getPosition(index, width),
        });
      }
    }

    return sprites;
  }

  _parseTiles(data) {
    return data;
  }

  _parseSpritesheet(tilesets, tilesize, resources) {
    const name = tilesets[0].source.replace('.tsx', '');
    return new Spritesheet(resources[name].texture, tilesize);
  }

  _isTypeSprite(props) {
    return !!props && props.some(prop => prop.name === 'sprite' && prop.value);
  }

  _getPosition(index, width) {
    return [index % width, Math.floor(index / width)];
  }

  destroy() {
    this.spritesheet.destroy();
  }
}

export default Spriteset;
