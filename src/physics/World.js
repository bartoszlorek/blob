import RTree from 'rbush';
import {arrayRemove} from '@utils/array';
import Collider from './Collider';
import {calculateGravity} from '@models/physics';
import Force from '@models/Force';
import Vector from '@models/Vector';

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

  addDynamic(body) {
    this.bodies.push(body);
  }

  addStatic(body) {
    this.staticBodies.push(body);
    this.staticTree.insert(body);
  }

  addGroup(group) {
    group.children.forEach(child => {
      if (child.type === 'dynamic') {
        this.addDynamic(child);
      } else {
        this.addStatic(child);
      }
    });
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
        if (object1.isBody && object2.isTilemap) {
          this._handleBodyTilesCollider(collider, deltaTime);
        }
        break;
      case COLLIDER_OVERLAP:
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
    const {object1, object2, callback} = collider;
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
              this._separation(EDGE.RIGHT, object1, other);

              if (callback) {
                callback(EDGE.RIGHT, object1, other);
              }
            }
          } else if (object1.velocity.x < 0) {
            if (object1.minX < other.maxX) {
              this._separation(EDGE.LEFT, object1, other);

              if (callback) {
                callback(EDGE.LEFT, object1, other);
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
              this._separation(EDGE.BOTTOM, object1, other);

              if (callback) {
                callback(EDGE.BOTTOM, object1, other);
              }
            }
          } else if (object1.velocity.y < 0) {
            if (object1.minY < other.maxY) {
              this._separation(EDGE.TOP, object1, other);

              if (callback) {
                callback(EDGE.TOP, object1, other);
              }
            }
          }
        }
      }
    }
  }

  _separation(edge, object1, other) {
    switch (edge) {
      case EDGE.BOTTOM:
        object1.maxY = other.minY;
        object1.velocity.y = 0;
        break;

      case EDGE.TOP:
        object1.minY = other.maxY;
        object1.velocity.y = 0;
        break;

      case EDGE.LEFT:
        object1.minX = other.maxX;
        object1.velocity.x = 0;
        break;

      case EDGE.RIGHT:
        object1.maxX = other.minX;
        object1.velocity.x = 0;
        break;
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
