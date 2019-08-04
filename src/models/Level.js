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
    const effects = new Container();
    const cave = createCave(this.global, this.data);
    const enemies = createEnemies(this.global, this.data);
    const ground = createGround(this.global, this.data);
    const mines = createMines(this.global, this.data);
    const player = createPlayer(this.global, this.data);
    const prizes = createPrizes(this.global, this.data);

    this.refs.player = player;
    this.refs.effects = effects;

    this.add(ground);
    this.add(cave);
    this.add(prizes);
    this.add(mines);
    this.add(enemies);
    this.add(effects);
    this.add(player);

    // ---- physics layer ---- //
    this.physics.addDynamic(player);

    this.physics.gravity(player, ground, function(body) {
      body.gravity.applyTo(body.velocity);
      body.sprite.rotation = vectorRotation(body.gravity);
    });

    this.physics.collide(player, ground, function(edge, body, tiles) {
      body.jump.collide(edge, body, tiles);
      body.move.collide(edge, body, tiles);
    });

    this.resize();
    this.focus(player);
  }

  update(deltaTime) {
    this.physics.update(deltaTime);
    this.follow(this.refs.player);
  }
}

export default Level;
