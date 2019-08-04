import RTree from 'rbush';
import {arrayRemove} from '@utils/array';
import {calculateGravity} from './internal/gravity';
import Force from '@models/Force';
import Collider from '@physics/Collider';

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

    // object pools
    this._treeSearch = {};
    this._treeResult = [];
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

    // simulation phase
    // todo: limit simulation fps
    this.tree.clear();
    this.tree.load(this.bodies);

    const {length} = this.colliders;
    for (let i = 0; i < length; i++) {
      this._resolveCollider(this.colliders[i], deltaTime);
    }

    // cleanup phase
    while (this._destroyIndex > 0) {
      this._destroy(this._destroyStack[--this._destroyIndex]);
    }

    // post update phase
    index = this.bodies.length;

    while (index > 0) {
      this.bodies[--index].postUpdate(deltaTime);
    }
  }

  _resolveCollider(collider, deltaTime) {
    const {type, object1, object2} = collider;

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
    const shouldSeparate = type === COLLIDER_COLLIDE;

    const closest = object2.closest(object1.gridX, object1.gridY);
    const length = closest ? closest.length : 0;

    // x axis
    if (object1.velocity.x !== 0) {
      // todo: put this assigment in body.postUpdate
      object1.position.x += object1.velocity.x * deltaTime;

      for (let i = 0; i < length; i++) {
        const other = closest[i];

        if (other && object1.intersection(other)) {
          if (object1.velocity.x > 0) {
            if (object1.maxX > other.minX) {
              if (shouldSeparate) {
                this._separation(object1, other, EDGE.RIGHT);
              }
              if (callback) {
                callback(object1, other, EDGE.RIGHT);
              }
            }
          } else if (object1.velocity.x < 0) {
            if (object1.minX < other.maxX) {
              if (shouldSeparate) {
                this._separation(object1, other, EDGE.LEFT);
              }
              if (callback) {
                callback(object1, other, EDGE.LEFT);
              }
            }
          }
        }
      }
    }

    // y axis
    if (object1.velocity.y !== 0) {
      // todo: put this assigment in body.postUpdate
      object1.position.y += object1.velocity.y * deltaTime;

      for (let i = 0; i < length; i++) {
        const other = closest[i];

        if (other && object1.intersection(other)) {
          if (object1.velocity.y > 0) {
            if (object1.maxY > other.minY) {
              if (shouldSeparate) {
                this._separation(object1, other, EDGE.BOTTOM);
              }
              if (callback) {
                callback(object1, other, EDGE.BOTTOM);
              }
            }
          } else if (object1.velocity.y < 0) {
            if (object1.minY < other.maxY) {
              if (shouldSeparate) {
                this._separation(object1, other, EDGE.TOP);
              }
              if (callback) {
                callback(object1, other, EDGE.TOP);
              }
            }
          }
        }
      }
    }
  }

  _handleBodyGroupCollider(collider) {
    const {type, object1, object2, callback} = collider;
    const shouldSeparate = type === COLLIDER_COLLIDE;

    this._treeSearch.minX = object1.minX;
    this._treeSearch.minY = object1.minY;
    this._treeSearch.maxX = object1.maxX;
    this._treeSearch.maxY = object1.maxY;

    const tree = object2.type === 'static' ? this.staticTree : this.tree;
    const result = tree.search(this._treeSearch);
    const length = result.length;

    for (let i = 0; i < length; i++) {
      const other = result[i];

      if (object2.contains(other)) {
        const edge = this._collidingEdge(object1, other);

        if (shouldSeparate) {
          this._separation(object1, other, edge);
        }
        if (callback) {
          callback(object1, other, edge);
        }
      }
    }
  }

  _separation(object1, object2, edge) {
    switch (edge) {
      case EDGE.BOTTOM:
        object1.maxY = object2.minY;
        object1.velocity.y = 0;
        break;

      case EDGE.TOP:
        object1.minY = object2.maxY;
        object1.velocity.y = 0;
        break;

      case EDGE.LEFT:
        object1.minX = object2.maxX;
        object1.velocity.x = 0;
        break;

      case EDGE.RIGHT:
        object1.maxX = object2.minX;
        object1.velocity.x = 0;
        break;
    }
  }

  _collidingEdge(object1, object2) {
    const diffX = object1.minX - object2.minX;
    const diffY = object1.minY - object2.minY;

    if (diffX === diffY) {
      return null;
    }
    if (Math.abs(diffX) > Math.abs(diffY)) {
      return diffX < 0 ? EDGE.RIGHT : EDGE.LEFT;
    } else {
      return diffY < 0 ? EDGE.BOTTOM : EDGE.TOP;
    }
  }

  _destroy(body) {
    body.unsafeDestroy();

    if (body.type === 'dynamic') {
      arrayRemove(this.bodies, body);
      this.tree.remove(body);
    } else if (body.type === 'static') {
      arrayRemove(this.staticBodies, body);
      this.staticTree.remove(body);
    }
  }
}

export default World;
