import RTree from 'rbush';
import {DYNAMIC_TYPE, STATIC_TYPE} from './Body';
import Collider from './Collider';

class World {
  constructor() {
    // dynamic
    this.dynamicBodies = new Set();
    this.dynamicTree = new RTree();

    // static
    this.staticBodies = new Set();
    this.staticTree = new RTree();

    // processing
    this.updated = false;
    this.pendingDestroy = new Set();
    this.colliders = [];

    // parameters
    this.stepsRate = 0.5;
  }

  add(body) {
    if (body.type === DYNAMIC_TYPE) {
      this.dynamicBodies.set(body);
    } else if (body.type === STATIC_TYPE) {
      this.staticBodies.set(body);
      this.staticTree.insert(body);
    }
    return body;
  }

  collide(object1, object2, callback) {
    this.colliders.push(new Collider(this, object1, object2, callback));
  }

  overlap() {
    this.colliders.push(new Collider(this, object1, object2, callback, true));
  }

  update(deltaTime) {
    if (this.dynamicBodies.size === 0) {
      return;
    }
    const {entries} = this.dynamicBodies;
    const shouldUpdate = true; // todo: proper logic

    for (let i = 0; i < entries.length; i++) {
      entries[i].update(deltaTime);
    }

    if (shouldUpdate) {
      this.updated = true;

      this.dynamicTree.clear();
      this.dynamicTree.load(entries);

      for (let i = 0; i < this.colliders.length; i++) {
        const collider = this.colliders[i];

        // collider.update();
      }
    }
  }

  postUpdate() {
    if (this.updated) {
      const {entries} = this.dynamicBodies;

      for (let i = 0; i < entries.length; i++) {
        entries[i].postUpdate(deltaTime);
      }
    }

    const pending = this.pendingDestroy;

    if (pending.size > 0) {
      const bodies = pending.entries;

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];

        if (body.type === DYNAMIC_TYPE) {
          this.dynamicBodies.delete(body);
          this.dynamicTree.remove(body);
        } else if (body.type === STATIC_TYPE) {
          this.staticBodies.delete(body);
          this.staticTree.remove(body);
        }

        body.parent = null;
        body.sprite = null;
      }

      pending.clear();
    }
  }
}

export default World;
