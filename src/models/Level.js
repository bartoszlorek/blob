import {baseSize} from '@app/consts';
import Scene from '@models/Scene';
import Spritesheet from '@models/Spritesheet';
import {vectorRotation} from '@utils/physics';
import Tileset from '@models/Tileset';
import Pointer from '@models/Pointer';

import {createPlayer} from '@layers';

class Level extends Scene {
  constructor({global, specs}) {
    super(global);

    //
    this.specs = specs;
  }

  create() {
    this.sheet = this.createSpritesheet();

    const props = {
      sheet: this.sheet,
      specs: this.specs.sprites,
    };

    const tiles = new Tileset(this.specs.tiles);
    tiles.fromSpritesheet(this.sheet);

    const [player, cleanupPlayer] = createPlayer(props);

    this.foreground.addChild(tiles.graphics);
    this.foreground.addChild(player.sprite);
    this.refs.player = player;

    const pointer = new Pointer(this.global);
    this.foreground.addChild(pointer.marker);

    pointer.onClick = (x, y) => {
      const dist = tiles.raycast(x, y, 0, 1);
      console.log({x, y, dist});
    };

    //

    // physics
    // this.physics.addBody(player);
    // this.physics.gravity(player, tiles, body => {
    //   body.gravity.applyTo(body.velocity);
    //   body.sprite.rotation = vectorRotation(body.gravity);
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
