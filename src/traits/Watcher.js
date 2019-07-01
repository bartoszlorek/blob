import Trait from '@traits/Trait';
import Memo from '@models/Memo';

class Watcher extends Trait {
  constructor({speed, ground}) {
    super('watcher');
    this.speed = speed;
    this.ground = ground;
    this.direction = 1;
    this.memo = new Memo();
  }

  update(entity, deltaTime) {
    const mat = this.closestGround(entity);
    const groundUnderFeet = mat.n(1, 2);

    if (!groundUnderFeet) {
      entity.destroy();
    }
    const beforeWall = mat.n(1 + this.direction, 1);
    const beforeHole = !mat.n(1 + this.direction, 2);

    if (beforeWall || beforeHole) {
      const touchedEdge =
        this.direction > 0
          ? entity.right > groundUnderFeet.right
          : entity.left < groundUnderFeet.left;

      if (touchedEdge) {
        this.direction = -this.direction;
        entity.sprite.scale.x = this.direction;
      }
    }

    // finally, apply movement
    entity.sprite.x += this.speed * this.direction * deltaTime;
  }

  closestGround(entity) {
    const {gridX, gridY} = entity;
    const fn = () => this.ground.entities.closest(entity, 1);
    return this.memo.use('closest', fn, [gridX, gridY]);
  }
}

export default Watcher;
