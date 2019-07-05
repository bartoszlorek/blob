import {Container} from 'pixi.js';
import {baseSize} from '@app/consts';
import layerCreators from '@layers';
import {lerp} from '@utils/math';
import {arrayForEach} from '@utils/array';
import {objectForEach} from '@utils/object';
import Background from '@models/Background';
import PhysicsEngine from '@models/PhysicsEngine';

const cameraRadius = 100;
const cameraSpeed = 0.01;

class Level {
  constructor(data) {
    this.data = data;
    this.name = data.name;
    this.global = null;
    this.layers = {};
    this.offsetX = 0;
    this.offsetY = 0;

    this.physics = new PhysicsEngine();
    this.background = new Background();
    this.foreground = new Container();
    this.helpers = new Container();

    this.elements = new Container();
    this.elements.addChild(this.background.sprite);
    this.elements.addChild(this.foreground);
    this.elements.addChild(this.helpers);
  }

  get player() {
    return (this.layers.player && this.layers.player.children[0]) || null;
  }

  onMount(global) {
    arrayForEach(layerCreators, create => {
      const layer = create(global, this.data);
      this.foreground.addChild(layer.graphics);
      this.layers[layer.name] = layer;

      // todo: better logic here
      if (layer.name === 'ground' || layer.name === 'mines') {
        this.physics.addCollision(layer);
      }
      if (layer.name === 'ground') {
        this.physics.addGravitation(layer);
      }
    });

    console.log(this.layers);

    this.global = global;
    this.global.events.onResize(() => this.resize());
    this.background.set(global.assets.gradient.texture);
    this.resize();
  }

  onUnmount() {}

  update(deltaTime) {
    this.cameraFollows();
    objectForEach(this.layers, layer => {
      layer.update(deltaTime);
    });
  }

  resize() {
    this.background.resize();
    objectForEach(this.layers, layer => {
      layer.graphics.x = this.global.rootX;
      layer.graphics.y = this.global.rootY;
    });
  }

  cameraFollows() {
    if (!this.player) {
      return;
    }
    const {x, y} = this.player.sprite;
    const a = x + this.offsetX;
    const b = y + this.offsetY;
    const distance = Math.sqrt(a * a + b * b);

    if (distance < baseSize) {
      return;
    }
    const factor = Math.min(1, distance / cameraRadius);
    this.offsetX = lerp(this.offsetX, -x, cameraSpeed * factor);
    this.offsetY = lerp(this.offsetY, -y, cameraSpeed * factor);

    // apply offset to visible elements
    this.foreground.position.set(this.offsetX, this.offsetY);
    this.helpers.position.set(this.offsetX, this.offsetY);
  }
}

export default Level;
