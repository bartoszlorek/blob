import {Container, TilingSprite, filters} from 'pixi.js';
import {RGBSplitFilter} from '@pixi/filter-rgb-split';
import loader from '../loader';

import {lerp} from '@utils/math';
import {arrayForEach} from '@utils/array';
import {objectForEach} from '@utils/object';
import padBounds from '@utils/padBounds';

import Background from '@models/Background';
import PhysicsEngine from '@models/PhysicsEngine';

import createMines from '@layers/createMines';
import createEffects from '@layers/createEffects';
import createGround from '@layers/createGround';
import createPlayer from '@layers/createPlayer';
import createPrizes from '@layers/createPrizes';

const solidLayers = ['ground', 'mines'];
const foregroundPadding = 10;
const cameraRadius = 5000;
const cameraSpeed = 0.01;

const factories = [
  createGround,
  createMines,
  createPrizes,
  createEffects,
  createPlayer
];

class Level {
  constructor(data) {
    this.data = data;
    this.name = data.name;

    this.global = null;
    this.layers = {};
    this.physics = new PhysicsEngine();
    this.offsetX = 0;
    this.offsetY = 0;

    this.background = new Container();
    this.foreground = new Container();
    this.helpers = new Container();

    this.elements = new Container();
    this.elements.addChild(this.background);
    this.elements.addChild(this.foreground);
    this.elements.addChild(this.helpers);

    this.foreground.filters = [
      new RGBSplitFilter([1, 0], [-1, 0], [0, 2]),
      new filters.BlurFilter(0.25)
    ];

    this.background.addChild(
      new TilingSprite(loader.resources.gradient.texture)
    );
  }

  get player() {
    return this.layers.player.entities.items[0] || null;
  }

  onLoad(global) {
    this.global = global;
    this.resize();

    arrayForEach(factories, factory => {
      const layer = factory(global, this.data);
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
    this.cameraFollows();
  }

  render(global) {
    objectForEach(this.layers, layer => layer.render(global));
  }

  resize() {
    this.resizeBackground();
  }

  resizeForeground() {
    const bounds = this.foreground.getBounds();
    this.foreground.filterArea = padBounds(bounds, foregroundPadding);
  }

  resizeBackground() {
    const {screen} = this.global.app;
    this.background.children.forEach(sprite => {
      sprite.width = screen.width;
      sprite.height = screen.height;
      sprite.tileScale.y = screen.height / sprite.texture.height;
    });
  }

  cameraFollows() {
    if (!this.player) {
      return;
    }
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const playerX = centerX - this.player.pos.x;
    const playerY = centerY - this.player.pos.y;

    const x = playerX - this.global.rootX;
    const y = playerY - this.global.rootY;
    const factor = Math.min(x * x + y * y, cameraRadius) / cameraRadius;

    this.offsetX = lerp(this.offsetX, x, cameraSpeed * factor);
    this.offsetY = lerp(this.offsetY, y, cameraSpeed * factor);

    // apply offset to visible elements
    this.foreground.x = this.offsetX;
    this.foreground.y = this.offsetY;
    this.helpers.x = this.offsetX;
    this.helpers.y = this.offsetY;
  }
}

export default Level;
