import Spritesheet from './Spritesheet';

class Spriteset {
  constructor(json, resources) {
    this.width = json.width;
    this.height = json.height;
    this.tilesize = json.tilewidth;

    const props = this.parseProperties(json.properties, {
      backgroundEdges: value => stringToIntArray(value),
    });

    this.background = this.parseBackground(
      props.backgroundEdges,
      json.tilewidth,
      resources
    );

    this.layers = this.parseLayers(json.layers);
    this.spritesheet = this.parseSpritesheet(
      json.tilesets,
      json.tilewidth,
      resources
    );

    console.log(this);
  }

  parseLayers(rawLayers) {
    const layers = {};

    rawLayers.forEach(layer => {
      const {name, data, width, properties} = layer;

      if (this.isTypeSprite(properties)) {
        layers[name] = {
          sprites: this.parseSprite(data, width),
        };
      } else {
        layers[name] = {
          tilemap: this.parseTiles(data),
          offset: [0, 0],
          width,
        };
      }
    });

    return layers;
  }

  parseSprite(data, width) {
    const sprites = [];

    for (let index = 0; index < data.length; index++) {
      const id = data[index];

      if (id > 0) {
        sprites.push({
          id,
          position: this.getPosition(index, width),
        });
      }
    }

    return sprites;
  }

  parseTiles(data) {
    return data;
  }

  parseSpritesheet(tilesets, tilesize, resources) {
    const name = tilesets[0].source.replace('.tsx', '');
    return new Spritesheet(resources[name].texture, tilesize);
  }

  parseBackground(edges = [], tilesize, resources) {
    const {texture} = resources['background'];
    const tileheight = texture.height / tilesize;

    return {
      edges: edges.map(value => value / tileheight),
      texture,
    };
  }

  parseProperties(props, filter = {}) {
    const result = {};

    props.forEach(prop => {
      const {name, value} = prop;
      result[name] = filter[name] ? filter[name](value) : value;
    });
    return result;
  }

  isTypeSprite(props) {
    return !!props && props.some(prop => prop.name === 'sprite' && prop.value);
  }

  getPosition(index, width) {
    return [index % width, Math.floor(index / width)];
  }

  destroy() {
    this.spritesheet.destroy();
  }
}

function stringToIntArray(string) {
  return string
    .split(',')
    .filter(a => a !== ',')
    .map(a => parseInt(a));
}

export default Spriteset;
