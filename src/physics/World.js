import {arrayRemove} from '@utils/array';
import Force from '@models/Force';
import Collider, {colliderType} from '@physics/Collider';

import {resolveCollider} from './resolvers';

export const EDGE = {
  TOP: Symbol('top'),
  RIGHT: Symbol('right'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left'),
};

class World {
  constructor() {
    this.bodies = [];
    this.colliders = [];

    // processing
    this._destroyStack = [];
    this._destroyIndex = 0;
  }

  update(deltaTime) {
    // update phase
    for (let index = 0; index < this.bodies.length; index++) {
      const body = this.bodies[index];

      if (body.isAlive) {
        body.update(deltaTime);
      } else {
        this._destroyStack[this._destroyIndex++] = body;
      }
    }

    // cleanup phase
    while (this._destroyIndex > 0) {
      this._destroy(this._destroyStack[--this._destroyIndex]);
    }

    // simulation phase
    for (let index = 0; index < this.colliders.length; index++) {
      resolveCollider(this.colliders[index], deltaTime);
    }
  }

  addBody(body) {
    if (!body.isBody) {
      throw `${body.constructor.name} is not a Body`;
    }
    this.bodies.push(body);
  }

  gravity(object1, object2, callback) {
    this.colliders.push(
      new Collider({
        type: colliderType.gravity,
        object1,
        object2,
        callback,
      })
    );

    object1.gravity = new Force(0, 1, {
      strength: 0.1, //25,
      dexterity: 0.6,
    });
  }

  collide(object1, object2, callback) {
    this.colliders.push(
      new Collider({
        type: COLLIDER_COLLIDE,
        tree: this._getCommonTree(object2),
        world: this,
        object1,
        object2,
        callback,
      })
    );
  }

  overlap(object1, object2, callback) {
    this.colliders.push(
      new Collider({
        type: COLLIDER_OVERLAP,
        tree: this._getCommonTree(object2),
        world: this,
        object1,
        object2,
        callback,
      })
    );
  }

  updateColliders(body) {
    let index = this.colliders.length;

    while (index > 0) {
      this.colliders[--index].update(body);
    }
  }

  _handleGravityCollider(collider, deltaTime) {
    const {object1, object2, callback} = collider;
    const result = calculateGravity(object1, object2);

    if (result) {
      object1.gravity.apply(result.x, result.y);
    }
    callback(object1, object2, deltaTime);
  }

  _handleBodyTilesCollider(collider, deltaTime) {
    const {type, object1, object2, callback} = collider;
    const separate = type === COLLIDER_COLLIDE;
    bodyTilesCollision(object1, object2, callback, separate, deltaTime);
  }

  _handleBodyGroupCollider(collider) {
    const {type, object1, object2, callback, tree} = collider;
    const separate = type === COLLIDER_COLLIDE;
    bodyGroupCollision(object1, object2, callback, separate, tree);
  }

  _destroy(body) {
    if (body.type === 'dynamic') {
      arrayRemove(this.bodies, body);
      this.tree.remove(body);
    } else if (body.type === 'static') {
      arrayRemove(this.staticBodies, body);
      this.staticTree.remove(body);
    }
    // disable unused colliders
    this.updateColliders(body);

    // actual removal
    body.unsafeDestroy();
  }
}

export default World;
