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
    // ---- background layer ---- //
    const {background: bgData} = this.data;

    this.background.set(
      this.global.assets[bgData.texture].texture,
      bgData.breakpoints
    );

    // ---- foreground layer ---- //
    const props = {
      data: this.data,
      global: this.global,
      scene: this
    };

    const effects = new Container();
    const cave = createCave(props);
    const enemies = createEnemies(props);
    const ground = createGround(props);
    const mines = createMines(props);
    const player = createPlayer(props);
    const prizes = createPrizes(props);

    this.refs.player = player;
    this.refs.ground = ground;
    this.refs.effects = effects;

    this.add(ground);
    this.add(cave);
    this.add(prizes);
    this.add(mines);
    this.add(enemies);
    this.add(effects);
    this.add(player);

    // ---- physics layer ---- //
    this.physics.add(player);
    this.physics.add(prizes);
    this.physics.add(mines);

    this.physics.gravity(player, ground, body => {
      body.gravity.applyTo(body.velocity);
      body.sprite.rotation = vectorRotation(body.gravity);
    });

    this.physics.collide(player, ground, (body, tile, edge) => {
      body.jump.collide(body, tile, edge);
      body.move.collide(body, tile, edge);
    });

    this.physics.collide(player, mines, (body, mine, edge) => {
      body.jump.collide(body, mine, edge);
      body.move.collide(body, mine, edge);
      mine.explosive.ignite();
    });

    this.physics.overlap(player, prizes, (body, prize, edge) => {
      this.global.events.publish('score');
      prize.destroy();
    });

    this.resize();
    this.focus(player);
    console.log(this);
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
    this.follow(this.refs.player);
  }
}

export default Level;
