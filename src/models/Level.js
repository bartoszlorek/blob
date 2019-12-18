import {baseSize} from '@app/consts';
import Scene from '@models/Scene';
import Spritesheet from '@models/Spritesheet';
import {vectorRotation} from '@utils/physics';
import Pointer from '@models/Pointer';

import {createPlayer, createTiles} from '@layers';

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

    // const pointer = new Pointer(this.global);
    // this.foreground.addChild(pointer.marker);
    // pointer.onClick = (x, y) => {};

    // physics
    this.physics.addChild(player);

    this.physics.collideBodyTiles(player, tiles, (body, edge) => {
      body.jump.collide(body, edge);
      body.move.collide(body, edge);
    });

    this.physics.gravityBodyTiles(player, tiles);

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
