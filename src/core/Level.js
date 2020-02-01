import Scene from '@core/Scene';

import {
  createBack,
  createEnemies,
  createFront,
  createGems,
  createGround,
  createMines,
  createPlayer,
} from '@layers';

class Level extends Scene {
  constructor(global, spriteset) {
    super(global, spriteset);
  }

  create() {
    const props = {
      global: this.global,
      spriteset: this.spriteset,
    };

    const [ground] = createGround(props);
    const [back] = createBack(props);
    const [gems] = createGems(props);
    const [mines] = createMines(props);
    const [enemies] = createEnemies(props);
    const [player] = createPlayer(props);
    const [front] = createFront(props);

    // renderer
    this.renderChild(ground);
    this.renderChild(back);
    this.renderChild(gems);
    this.renderChild(mines);
    this.renderChild(enemies);
    this.renderChild(player);
    this.renderChild(front);

    this.refs.player = player;
    this.refs.ground = ground;

    // physics
    this.physics.processChild(player);
    this.physics.processChild(mines);

    this.physics.overlapBody(player, gems, function() {});

    this.physics.overlapBody(player, mines, function(player, mine) {
      mine.action['explosive'].ignite();
    });

    // this.physics.collideBody(player, mines, function(body, mines, edge) {
    //   body.action['jump'].collide(body, edge);
    //   body.action['move'].collide(body, edge);
    // });

    this.physics.collideTile(player, ground, function(body, ground, edge) {
      body.action['jump'].collide(body, edge);
      body.action['move'].collide(body, edge);
    });

    this.physics.gravityTile(player, ground);

    // events
    this.global.events.on('player/dead', () => this.global.stop());
    // this.focus(player);
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
    // this.follow(this.refs.player);
  }
}

export default Level;
