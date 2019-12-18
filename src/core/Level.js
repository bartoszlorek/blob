import {baseSize} from '@app/consts';
import Scene from '@core/Scene';
import Spritesheet from '@core/Spritesheet';

import {createPlayer, createTiles} from '@layers';

class Level extends Scene {
  constructor({global, data}) {
    super(global);

    //
    this.data = data;
  }

  create() {
    this.sheet = this.createSpritesheet();

    const props = {
      global: this.global,
      sheet: this.sheet,
      data: this.data,
    };

    const [tiles] = createTiles(props);
    const [player] = createPlayer(props);

    this.foreground.addChild(tiles.graphics);
    this.foreground.addChild(player.sprite);
    this.refs.player = player;

    // physics
    this.physics.addChild(player);

    this.physics.collideBodyTiles(player, tiles, function(body, edge) {
      body.action['jump'].collide(body, edge);
      body.action['move'].collide(body, edge);
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
    const {name} = this.data.spritesheet;
    const {texture} = this.global.assets[name];
    return new Spritesheet({texture, size: baseSize});
  }

  setupBackground() {
    const {name, breaks} = this.data.background;
    this.background.set(this.global.assets[name].texture, breaks);
  }
}

export default Level;
