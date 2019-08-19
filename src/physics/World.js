import RTree from 'rbush';
import {arrayRemove, mergeArrays} from '@utils/array';
import {calculateGravity} from './internal/gravity';
import Force from '@models/Force';
import Collider from '@physics/Collider';

import bodyTilesCollision from './collisions/bodyTilesCollision';
import bodyGroupCollision from './collisions/bodyGroupCollision';

const COLLIDER_COLLIDE = Symbol('collide');
const COLLIDER_OVERLAP = Symbol('overlap');
const COLLIDER_GRAVITY = Symbol('gravity');

export const EDGE = {
  TOP: Symbol('top'),
  RIGHT: Symbol('right'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left')
};

class World {
  constructor() {
    this.bodies = [];
    this.staticBodies = [];
    this.colliders = [];

    // r-trees
    this.tree = new RTree();
    this.staticTree = new RTree();

    // processing
    this._destroyStack = [];
    this._destroyIndex = 0;
  }

  add(entity) {
    if (entity.isBody) {
      if (entity.type === 'dynamic') {
        this.bodies.push(entity);
      }
      if (entity.type === 'static') {
        this.staticBodies.push(entity);
        this.staticTree.insert(entity);
      }
    } else if (entity.isGroup) {
      entity.children.forEach(child => {
        this.add(child);
      });
    }
  }

  collide(object1, object2, callback) {
    this.colliders.push(
      new Collider({
        type: COLLIDER_COLLIDE,
        tree: this._getCommonTree(object2),
        world: this,
        object1,
        object2,
        callback
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
        callback
      })
    );
  }

  gravity(object1, object2, callback) {
    this.colliders.push(
      new Collider({
        type: COLLIDER_GRAVITY,
        world: this,
        object1,
        object2,
        callback
      })
    );

    object1.gravity = new Force(0, 1, {
      strength: 25,
      dexterity: 0.6
    });
  }

  update(deltaTime) {
    let index;

    // dynamic bodies phase
    index = this.bodies.length;

    while (index > 0) {
      const body = this.bodies[--index];

      if (body.isAlive) {
        body.update(deltaTime);
      } else {
        this._destroyStack[this._destroyIndex++] = body;
      }
    }

    // static bodies phase
    index = this.staticBodies.length;

    while (index > 0) {
      const body = this.staticBodies[--index];

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
    // todo: limit simulation fps
    this.tree.clear();
    this.tree.load(this.bodies);

    const {length} = this.colliders;
    for (let i = 0; i < length; i++) {
      this._resolveCollider(this.colliders[i], deltaTime);
    }

    // post update phase
    index = this.bodies.length;

    while (index > 0) {
      this.bodies[--index].postUpdate(deltaTime);
    }
  }

  updateColliders(body) {
    let index = this.colliders.length;

    while (index > 0) {
      this.colliders[--index].update(body);
    }
  }

  _resolveCollider(collider, deltaTime) {
    if (!collider.isActive) {
      return;
    }
    const {object1, object2, type} = collider;

    switch (type) {
      case COLLIDER_GRAVITY:
        if (object1.isBody && object2.isTilemap) {
          this._handleGravityCollider(collider, deltaTime);
        }
        break;
      case COLLIDER_COLLIDE:
        if (object1.isBody) {
          if (object2.isTilemap) {
            this._handleBodyTilesCollider(collider, deltaTime);
          } else if (object2.isGroup) {
            this._handleBodyGroupCollider(collider);
          }
        }
        break;
      case COLLIDER_OVERLAP:
        if (object1.isBody && object2.isGroup) {
          this._handleBodyGroupCollider(collider);
        }
        break;
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

  _getCommonTree(elem) {
    let type = null;

    // prettier-ignore
    if (elem.isBody) {
      type = elem.type;
    }
    else if (elem.isGroup) {
      elem.forEach(child => {
        if (type !== child.type) {
          if (type === null) {
            type = child.type;
          } else {
            type = 'both';
            return false;
          }
        }
      });
    }
    switch (type) {
      case 'dynamic':
        return [this.tree];
      case 'static':
        return [this.staticTree];
      case 'both':
        return [this.tree, this.staticTree];
      default:
        return null;
    }
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
