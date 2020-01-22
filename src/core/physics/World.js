import {arrayRemove} from '@utils/array';
import {EDGE_BY_AXIS} from '@core/physics/constants';
import Constraint from '@core/physics/Constraint';
import Force from '@core/physics/Force';

import {
  bodyBodyOverlapResolver,
  bodyTilesCollisionResolver,
  bodyTilesGravityResolver,
} from '@core/physics/resolvers';

class World {
  constructor() {
    this.children = [];
    this.constraints = [];

    // processing
    this.removeStack = [];
    this.removeIndex = 0;
  }

  update(deltaTime) {
    // update phase
    for (let index = 0; index < this.children.length; index++) {
      this.children[index].update(deltaTime);
    }

    // cleanup phase
    while (this.removeIndex > 0) {
      this._unsafeRemoveChild(this.removeStack[--this.removeIndex]);
    }

    // physics phase
    for (let index = 0; index < this.constraints.length; index++) {
      this.constraints[index].update(deltaTime);
    }
  }

  processChild(child) {
    if (child.isBody) {
      this.children.push(child);
      child.parent = this;
    } else if (child.isGroup) {
      child.forEach(a => this.processChild(a));
    }
  }

  removeChild(child) {
    this.removeStack[this.removeIndex++] = child;
  }

  _unsafeRemoveChild(child) {
    arrayRemove(this.children, child);
    this._updateConstraintActors(child);
    child.unsafeDestroy();
  }

  _updateConstraintActors(child) {
    for (let index = 0; index < this.constraints.length; index++) {
      this.constraints[index].removeActor(child);
    }
  }

  // --------------------------
  // Defined Common Constraints
  // --------------------------

  collideTile(body, tiles, callback) {
    const effect = (value, index, axis, shift, velocity) => {
      const point = tiles.getPoint(index);
      const side = body.min[axis] < point[axis] * tiles.tilesize;
      const edge = EDGE_BY_AXIS[axis][+side];

      velocity[axis] = shift; // todo: use actual velocity
      callback(body, tiles, edge);
      return true;
    };

    const rule = new Constraint({
      actorA: body,
      actorB: tiles,
      resolver: bodyTilesCollisionResolver,
      effect,
    });

    this.constraints.push(rule);
  }

  gravityTile(body, tiles) {
    body.gravity = new Force(0, 1, {
      str: 25,
      dex: 0.6,
    });

    const rule = new Constraint({
      actorA: body,
      actorB: tiles,
      resolver: bodyTilesGravityResolver,
    });

    this.constraints.push(rule);
  }

  overlapBody(bodyA, bodyB, callback) {
    const rule = new Constraint({
      actorA: bodyA,
      actorB: bodyB,
      resolver: bodyBodyOverlapResolver,
      effect: callback,
    });

    this.constraints.push(rule);
  }
}

export default World;
