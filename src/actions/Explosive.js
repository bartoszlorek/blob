import {baseSize} from '@app/consts';
import BoundingBox from '@core/BoundingBox';
import Action from '@core/Action';

const destoryTilemap = (value, index, tilemap) => {
  tilemap.removeByIndex(index);
};

class Explosive extends Action {
  constructor(global, range = baseSize) {
    super('explosive');
    this.global = global;
    this.active = false;

    const size = range * 2 + baseSize;
    this.area = new BoundingBox([0, 0], [size, size]);
    this.range = range;
    this.timer = 0;

    // parameters
    this.delay = 0.3;
  }

  ignite() {
    this.active = true;
  }

  update(bomb, deltaTime) {
    if (this.active === false) {
      return;
    }

    if (this.timer === 0) {
      // todo: start animation
    }

    if (this.timer >= this.delay) {
      const {player, ground} = this.global.scene.refs;

      this.area.alignX(bomb.min[0] - this.range);
      this.area.alignY(bomb.min[1] - this.range);

      // todo: add blast sprite
      ground.search(this.area, destoryTilemap);
      bomb.destroy();

      if (this.area.intersects(player)) {
        this.global.events.publish('player_dead');
        player.destroy();
      }
    }

    this.timer += deltaTime;
  }
}

export default Explosive;
