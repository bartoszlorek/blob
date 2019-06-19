import {Container, filters, loader, extras} from 'pixi.js';
import {RGBSplitFilter} from '@pixi/filter-rgb-split';
import {arrayForEach} from '@utils/array';
import {objectForEach} from '@utils/object';
import padBounds from '@utils/padBounds';

import Background from '@models/Background';
import PhysicsEngine from '@models/PhysicsEngine';

import createBombs from '@layers/createBombs';
import createEffects from '@layers/createEffects';
import createGround from '@layers/createGround';
import createPlayer from '@layers/createPlayer';
import createPrizes from '@layers/createPrizes';

const STAGE_PADDING = 10;
const solidLayers = ['ground', 'bombs'];

const factories = [
  createGround,
  createBombs,
  createPrizes,
  createEffects,
  createPlayer
];

class Level {
  constructor(data) {
    this._data = data;

    this.name = data.name;
    this.global = null;
    this.layers = {};
    this.physics = new PhysicsEngine();

    this.foreground = new Container();
    this.background = new Container();
    this.elements = new Container();
    this.elements.addChild(this.background);
    this.elements.addChild(this.foreground);

    this.foreground.filters = [
      new RGBSplitFilter([1, 0], [-1, 0], [0, 2]),
      new filters.BlurFilter(0.25)
    ];

    this.background.addChild(
      new extras.TilingSprite(loader.resources.gradient.texture)
    );
  }

  onLoad(global) {
    this.global = global;
    this.resize();

    arrayForEach(factories, factory => {
      const layer = factory(this._data, global, this);
      layer.level = this;

      this.foreground.addChild(layer.graphics);
      this.layers[layer.name] = layer;

      if (solidLayers.includes(layer.name)) {
        this.physics.addSolids(layer);
      }
    });
  }

  onUnload() {}

  update(deltaTime) {
    objectForEach(this.layers, layer => layer.update(deltaTime));
    this.resizeForeground();
  }

  render(global) {
    objectForEach(this.layers, layer => layer.render(global));
  }

  resize() {
    this.resizeBackground();
  }

  resizeForeground() {
    const bounds = this.foreground.getBounds();
    this.foreground.filterArea = padBounds(bounds, STAGE_PADDING);
  }

  resizeBackground() {
    const {screen} = this.global.app;
    this.background.children.forEach(sprite => {
      sprite.width = screen.width;
      sprite.height = screen.height;
      sprite.tileScale.y = screen.height / sprite.texture.height;
    });
  }
}

export default Level;
