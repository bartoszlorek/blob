import Scene from '@core/Scene';
import {createPlayer, createGround, createPrizes, createMines} from '@layers';

class Level extends Scene {
  constructor(global, spriteset) {
    super(global);

    this.spriteset = spriteset;
  }

  create() {
    const props = {
      global: this.global,
      spriteset: this.spriteset,
    };

    const [ground] = createGround(props);
    const [player] = createPlayer(props);
    // const [prizes] = createPrizes(props);
    // const [mines] = createMines(props);

    // renderer
    this.renderChild(ground);
    this.renderChild(player);
    // this.renderChild(prizes);
    // this.renderChild(mines);
    this.refs.player = player;
    this.refs.ground = ground;

    // physics
    this.physics.processChild(player);
    // this.physics.processChild(mines);

    // this.physics.overlapBody(player, prizes, function() {});

    // this.physics.overlapBody(player, mines, function(player, mine) {
    //   mine.action['explosive'].ignite();
    // });

    this.physics.collideTile(player, ground, function(body, ground, edge) {
      body.action['jump'].collide(body, edge);
      body.action['move'].collide(body, edge);
    });

    this.physics.gravityTile(player, ground);

    // final
    // this.setupBackground();
    this.resize();
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
    // this.follow(this.refs.player);
  }

  setupBackground() {
    const {name, breaks} = this.data.background;
    this.background.set(this.global.assets[name].texture, breaks);
  }
}

export default Level;
