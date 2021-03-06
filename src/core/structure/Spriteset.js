// @flow strict

import Spritesheet from './Spritesheet';
import tilesetsData from '@data/tilesets';

import type PIXI, {IResourceDictionary} from 'pixi.js';
import type {TiledMapJson} from './TiledMapEditor';
import type {VectorType} from '@core/physics/Vector';
import type {BaseSpritesheet} from './Spritesheet';

type SpriteLayer = {
  type: 'spriteLayer',
  sprites: Array<{
    id: number,
    position: VectorType,
  }>,
};

type TileLayer = {
  type: 'tileLayer',
  tilemap: Array<number>,
  offset: VectorType,
  width: number,
};

class Spriteset {
  width: number;
  height: number;
  tilesize: number;
  background: {
    slices: Array<number>,
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
      backgroundTilepoints: value =>
        typeof value === 'string' ? stringToIntArray(value) : [],
    });

    this.layers = this.parseLayers(json.layers);
    this.spritesheet = this.parseSpritesheets(json.tilesets, resources);
    this.background = this.parseBackground(
      props.backgroundTilepoints,
      json.tilewidth,
      resources
    );
  }

  parseLayers(rawLayers: $PropertyType<TiledMapJson, 'layers'>) {
    const layers = {};

    rawLayers.forEach(layer => {
      const {name, data, width, properties} = layer;

      if (this.isTypeSprite(properties)) {
        layers[name] = {
          type: 'spriteLayer',
          sprites: this.parseSprite(data, width),
        };
      } else {
        layers[name] = {
          type: 'tileLayer',
          tilemap: this.parseTiles(data),
          offset: [0, 0], // hardcoded?
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

  parseSpritesheets(
    tilesets: $PropertyType<TiledMapJson, 'tilesets'>,
    resources: IResourceDictionary
  ) {
    const input = tilesets.map<BaseSpritesheet>((tileset, index, sets) => {
      const {source, firstgid: firstId} = tileset;
      const name = source.replace('.json', '');

      const nextTileset = sets[index + 1];
      const lastId = nextTileset ? nextTileset.firstgid - 1 : Infinity;
      const {baseTexture} = resources[name].texture;
      const tilesize = tilesetsData[name].tilewidth;

      return {
        baseTexture,
        tilewidth: baseTexture.width / tilesize,
        tilesize,
        firstId,
        lastId,
      };
    });

    return new Spritesheet(input);
  }

  parseBackground(
    tilepoints: Array<number> = [],
    tilesize: number,
    resources: IResourceDictionary
  ) {
    const {texture} = resources['background'];
    const height = texture.height / tilesize;

    return {
      slices: tilepoints.map<number>(value => value / height),
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
