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

    const [ground, cleanupGround] = createGround(props);
    const [back, cleanupBack] = createBack(props);
    const [gems, cleanupGems] = createGems(props);
    const [mines, cleanupMines] = createMines(props);
    const [enemies, cleanupEniemies] = createEnemies(props);
    const [player, cleanupPlayer] = createPlayer(props);
    const [front, cleanupFront] = createFront(props);

    this.cleanup = () => {
      cleanupGround();
      cleanupBack();
      cleanupGems();
      cleanupMines();
      cleanupEniemies();
      cleanupPlayer();
      cleanupFront();
    };

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
    this.physics.processChild(gems);
    this.physics.processChild(mines);

    this.physics.overlapBody({
      bodyA: player,
      bodyB: gems,
      callback: (player, gem) => {
        gem.trait['collectible'].collect();
      },
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

    player.sprite.animation.play('idle');
  }

  update(deltaTime: number) {
    this.physics.update(deltaTime);
    this.animations.requestFrame(deltaTime);

    if (this.refs) {
      this.follow(this.refs.player);
    }
  }
}

export default Level;
