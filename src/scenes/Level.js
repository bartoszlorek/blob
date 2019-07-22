import {arrayForEach} from '@utils/array';
import Scene from '@models/Scene';
import PhysicsEngine from '@models/PhysicsEngine';

import layerCreators from '@layers';

class Level extends Scene {
  constructor(data, global) {
    super(data.name, global);
    // todo: load data here

    this.physics = new PhysicsEngine();
    this.background.set(global.assets.gradient.texture);
    this.resize();

    arrayForEach(layerCreators, create => {
      const layer = create(data, global, this);
      this.foreground.addChild(layer.graphics);
      this.layers[layer.name] = layer;

      if (layer.name === 'ground') {
        this.physics.addGravitation(layer);
      }
    });

    this.physics.setCollisions(this.layers);
    this.focus(this.player, false);
  }

  update(deltaTime) {
    const names = Object.keys(this.layers);
    let i = names.length;
    let j = names.length;

    // update phase: velocity and visible traits
    // like animations or colors apply here
    while (i > 0) {
      this.layers[names[--i]].update(deltaTime);
    }

    // physics phase: velocity changes the position
    // of entities based on collision and gravity
    this.physics.update(deltaTime);

    // post-update phase: remember layers state
    // to optimize searching in the next cycle
    while (j > 0) {
      this.layers[names[--j]].postUpdate();
    }

    // post-processes
    this.focus(this.player);
  }
}

export default Level;
