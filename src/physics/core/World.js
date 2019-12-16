import {arrayRemove} from '@utils/array';
import {EDGE_BY_AXIS} from '@physics/consts';
import Constraint from '@physics/core/Constraint';
import Force from '@models/Force';

import {
  bodyBodyOverlapResolver,
  bodyTilesCollisionResolver,
  bodyTilesGravityResolver,
} from '@physics/resolvers';

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

  addChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    this.removeStack[this.removeIndex++] = child;
    child.destroy();
  }

  _unsafeRemoveChild(child) {
    arrayRemove(this.children, child);
    this._verificateConstraints(child);
    child.unsafeDestroy();
  }

  _verificateConstraints(child) {
    for (let index = 0; index < this.constraints.length; index++) {
      this.constraints[index].verificate(child);
    }
  }

  // --------------------------
  // Defined Common Constraints
  // --------------------------

  collideBodyTiles(body, tiles, callback) {
    const effect = (value, index, axis, shift, velocity) => {
      const tileCoords = tiles.getCoordinates(index);
      const difference = body.min[axis] < tileCoords[axis] * tiles.tilesize;

      velocity[axis] = shift; // todo: use actual velocity
      callback(body, EDGE_BY_AXIS[axis][+difference]);
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

  gravityBodyTiles(body, tiles) {
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

  overlapBodyBody(bodyA, bodyB, callback) {
    const rule = new Constraint({
      actorA: bodyA,
      actorB: bodyB,
      // resolver: bodyBodyOverlapResolver,
      effect: callback,
    });

    this.constraints.push(rule);
  }
}

export default World;
