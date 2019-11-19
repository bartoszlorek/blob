import {baseSize} from '@app/consts';
import Scene from '@models/Scene';
import Spritesheet from '@models/Spritesheet';
import {vectorRotation} from '@utils/physics';
import Pointer from '@models/Pointer';

import {createPlayer, createTiles} from '@layers';

import Ray from '../physics/internal/Ray';

class Level extends Scene {
  constructor({global, specs}) {
    super(global);

    //
    this.specs = specs;
  }

  create() {
    this.sheet = this.createSpritesheet();

    const props = {
      global: this.global,
      sheet: this.sheet,
      specs: this.specs,
    };

    const [tiles] = createTiles(props);
    const [player] = createPlayer(props);

    this.foreground.addChild(tiles.graphics);
    this.foreground.addChild(player.sprite);
    this.refs.player = player;

    const pointer = new Pointer(this.global);
    this.foreground.addChild(pointer.marker);

    const rayTop = new Ray(0, -1);
    const rayRight = new Ray(1, 0);
    const rayBottom = new Ray(0, 1);
    const rayLeft = new Ray(-1, 0);

    pointer.onClick = (x, y) => {
      // rayTop.cast(tiles, x, y);
      rayRight.cast(tiles, x, y);
      // rayBottom.cast(tiles, x, y);
      // rayLeft.cast(tiles, x, y);

      console.log({rayRight});

      // console.log({rayTop, rayRight, rayBottom, rayLeft});
    };

    // physics
    // this.physics.addBody(player);
    // this.physics.gravity(player, tiles, body => {
    //   body.gravity.applyTo(body.velocity);
    //   // body.sprite.rotation = vectorRotation(body.gravity);
    // });

    // final
    this.setupBackground();
    this.resize();
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
    // this.follow(this.refs.player);
  }

  createSpritesheet() {
    const {name} = this.specs.spritesheet;
    const {texture} = this.global.assets[name];
    return new Spritesheet({texture, size: baseSize});
  }

  setupBackground() {
    const {name, breaks} = this.specs.background;
    this.background.set(this.global.assets[name].texture, breaks);
  }
}

export default Level;
