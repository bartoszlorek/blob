// @flow strict

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

import type Global from '@core/Global';
import type Spriteset from '@core/structure/Spriteset';
import type {LayerProps} from '@layers';

class Level extends Scene {
  constructor(global: Global, spriteset: Spriteset) {
    super(global, spriteset);
  }

  create(global: Global) {
    const props: LayerProps = {
      spriteset: this.spriteset,
      global,
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

    this.refs = {};
    this.refs.player = player;
    this.refs.ground = ground;

    // physics
    this.physics.processChild(player);
    this.physics.processChild(mines);

    this.physics.overlapBody({
      bodyA: player,
      bodyB: gems,
      callback: () => {},
    });

    this.physics.overlapBody({
      bodyA: player,
      bodyB: mines,
      callback: (player, mine) => {
        mine.trait['explosive'].ignite();
      },
    });

    this.physics.collideBody({
      bodyA: player,
      bodyB: mines,
      callback: (body, mines, edge) => {
        body.trait['jump'].collide(body, edge);
        body.trait['move'].collide(body, edge);
      },
    });

    this.physics.collideTile({
      body: player,
      tiles: ground,
      callback: (body, ground, edge) => {
        body.trait['jump'].collide(body, edge);
        body.trait['move'].collide(body, edge);
      },
    });

    this.physics.gravityTile({
      body: player,
      tiles: ground,
    });

    // events
    if (global) {
      global.events.on('player/dead', () => global.stop());
    }

    console.log(this);
  }

  update(deltaTime: number) {
    this.physics.update(deltaTime);

    if (this.refs) {
      this.follow(this.refs.player);
    }
  }
}

export default Level;
