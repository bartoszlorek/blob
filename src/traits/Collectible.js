// @flow strict

import Trait from '@core/Trait';
import Easing from '@core/Easing';

import type Global from '@core/Global';
import type Body from '@core/physics/Body';

class Collectible extends Trait {
  global: Global;
  easing: Easing;
  position: number | null;
  active: boolean;

  constructor(global: Global) {
    super('collectible');

    this.global = global;
    this.easing = new Easing(400);
    this.position = null;
    this.active = false;
  }

  collect() {
    this.active = true;
  }

  update(body: Body, deltaTime: number) {
    if (!this.active) {
      return;
    }
    const position = this.position;

    if (position === null) {
      this.position = body.min[1];
      this.global.events.emit('player/score');
    } else {
      const progress = this.easing.easeOutQuad(deltaTime);
      body.alignY(position - progress * (body.height * 0.75));

      if (progress >= 1) {
        body.destroy();
      }
    }
  }
}

export default Collectible;
