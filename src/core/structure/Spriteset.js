// @flow strict

import Spritesheet from './Spritesheet';

import type PIXI, {IResourceDictionary} from 'pixi.js';
import type {TiledMapJson} from './TiledMapEditor';

type SpriteLayer = {
  id: number,
  position: Array<number>,
};

type TileLayer = {
  tilemap: Array<number>,
  offset: Array<number>,
  width: number,
};

class Spriteset {
  width: number;
  height: number;
  tilesize: number;
  background: {
    edges: Array<number>,
    texture: PIXI.Texture,
  };
  layers: {
    [name: string]: SpriteLayer | TileLayer,
  };
  spritesheet: Spritesheet;

  constructor(json: TiledMapJson, resources: IResourceDictionary) {
    this.width = json.width;
    this.height = json.height;
    this.tilesize = json.tilewidth;

    const props = this.parseProperties(json.properties, {
      backgroundEdges: value =>
        typeof value === 'string' ? stringToIntArray(value) : [],
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

  parseLayers(rawLayers: $PropertyType<TiledMapJson, 'layers'>) {
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

  parseSprite(data: Array<number>, width: number) {
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

  parseTiles(data: Array<number>) {
    return data;
  }

  parseSpritesheet(
    tilesets: $PropertyType<TiledMapJson, 'tilesets'>,
    tilesize: number,
    resources: IResourceDictionary
  ) {
    const name = tilesets[0].source.replace('.tsx', '');
    return new Spritesheet(resources[name].texture, tilesize);
  }

  parseBackground(
    edges: Array<number> = [],
    tilesize: number,
    resources: IResourceDictionary
  ) {
    const {texture} = resources['background'];
    const tileheight = texture.height / tilesize;

    return {
      edges: edges.map<number>(value => value / tileheight),
      texture,
    };
  }

  parseProperties(
    props: $PropertyType<TiledMapJson, 'properties'>,
    filter: {[name: string]: (value: mixed) => mixed} = {}
  ) {
    const result = {};

    props.forEach(prop => {
      const {name, value} = prop;
      result[name] = filter[name] ? filter[name](value) : value;
    });
    return result;
  }

  isTypeSprite(props: $PropertyType<TiledMapJson, 'properties'>) {
    return !!props && props.some(prop => prop.name === 'sprite' && prop.value);
  }

  getPosition(index: number, width: number) {
    return [index % width, Math.floor(index / width)];
  }

  destroy() {
    this.spritesheet.destroy();
  }
}

function stringToIntArray(value: string) {
  return value
    .split(',')
    .filter(a => a !== ',')
    .map(a => parseInt(a));
}

export default Spriteset;
