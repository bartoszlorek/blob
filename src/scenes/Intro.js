import {Sprite} from 'pixi.js';
import {gridToLocal} from '@app/consts';

import Scene from '@models/Scene';
import Entity from '@models/Entity';

class Intro extends Scene {
  constructor(global) {
    super('intro', global);

    const {texture} = global.assets['player'];
    const child = new Entity(
      new Sprite(texture),
      gridToLocal(0),
      gridToLocal(0)
    );

    // todo: add layer and animation
    this.foreground.addChild(child.sprite);
    this.resize();
  }
}

export default Intro;
