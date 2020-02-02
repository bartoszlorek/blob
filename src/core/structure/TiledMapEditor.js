// @flow strict

type Property = {
  name: string,
  type: string,
  value: number | string | boolean,
};

export type TiledMapJson = {
  backgroundcolor: string,
  compressionlevel: number,
  editorsettings: {
    chunksize: {
      height: number,
      width: number,
    },
    export: {
      format: 'json',
      target: string,
    },
  },
  height: number,
  infinite: boolean,
  layers: Array<{
    data: Array<number>,
    height: number,
    id: number,
    name: string,
    opacity: number,
    properties: Array<Property>,
    type: 'string', // todo: proper enum,
    visible: boolean,
    width: number,
    x: number,
    y: number,
  }>,
  nextlayerid: number,
  nextobjectid: number,
  orientation: string, // todo: proper enum,
  properties: Array<Property>,
  renderorder: string, // todo: proper enum,
  tiledversion: string,
  tileheight: number,
  tilesets: Array<{
    firstgid: number,
    source: string,
  }>,
  tilewidth: number,
  type: string, // todo: proper enum,
  version: number,
  width: number,
};
