import {Container} from 'pixi.js';
import {vectorRotation} from '@utils/physics';
import Scene from '@models/Scene';

import {
  createCave,
  createEnemies,
  createGround,
  createMines,
  createPlayer,
  createPrizes
} from '@layers';

class Level extends Scene {
  constructor(global, data) {
    super('level', global, data);
  }

  create() {
    // ---- graphics layer ---- //
    const props = {
      data: this.data,
      global: this.global,
      scene: this
    };

    const effects = new Container();
    const [cave, cleanupCave] = createCave(props);
    const [enemies, cleanupEnemies] = createEnemies(props);
    const [ground, cleanupGround] = createGround(props);
    const [mines, cleanupMines] = createMines(props);
    const [player, cleanupPlayer] = createPlayer(props);
    const [prizes, cleanupPrizes] = createPrizes(props);

    if (!player) {
      throw 'player is required';
    }
    if (!ground) {
      throw 'ground is required';
    }
    if (!prizes) {
      throw 'prizes are required';
    }

    this.cleanup = function() {
      cleanupCave();
      cleanupEnemies();
      cleanupGround();
      cleanupMines();
      cleanupPlayer();
      cleanupPrizes();
    };

    this.refs.player = player;
    this.refs.ground = ground;
    this.refs.effects = effects;

    this.add(ground);

    if (cave) {
      this.add(cave);
    }
    if (mines) {
      this.add(mines);
    }
    if (enemies) {
      this.add(enemies);
    }

    this.add(prizes);
    this.add(effects);
    this.add(player);

    // ---- physics layer ---- //
    this.physics.add(player);
    this.physics.add(prizes);

    this.physics.gravity(player, ground, body => {
      body.gravity.applyTo(body.velocity);
      body.sprite.rotation = vectorRotation(body.gravity);
    });

    this.physics.collide(player, ground, (body, tile, edge) => {
      body.jump.collide(body, tile, edge);
      body.move.collide(body, tile, edge);
    });

    this.physics.overlap(player, prizes, (body, prize, edge) => {
      this.global.events.publish('score');
      prize.destroy();
    });

    if (mines) {
      this.physics.add(mines);
      this.physics.collide(player, mines, (body, mine, edge) => {
        body.jump.collide(body, mine, edge);
        body.move.collide(body, mine, edge);
        mine.explosive.ignite();
      });
    }

    if (enemies) {
      this.physics.add(enemies);
      this.physics.overlap(player, enemies, (body, enemy, edge) => {
        if (body.velocity.y > 0) {
          enemy.destroy();
        } else {
          this.global.events.publish('player_dead');
          body.destroy();
        }
      });
    }

    // ---- animations layer ---- //
    this.animations.keyframes['blast'] = [
      [10, (sprite, range) => sprite.scale.set(sprite.scale.x + range)],
      [100, (sprite, range) => sprite.scale.set(sprite.scale.x + range)],
      [200, (sprite, range) => sprite.scale.set(sprite.scale.x - range / 2)],
      [250, sprite => sprite.destroy()]
    ];

    this.setupBackground();
    this.resize();
    this.focus(player);

    console.log(this);
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
    this.animations.update(deltaTime);
    this.follow(this.refs.player);
  }

  setupBackground() {
    const {image, breaks} = this.data.background;
    this.background.set(this.global.assets[image].texture, breaks);
  }
}

export default Level;
