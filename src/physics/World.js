import RTree from 'rbush';
import {DYNAMIC_TYPE, STATIC_TYPE} from './Body';
import Collider from './Collider';

class World {
  constructor() {
    this.dynamicBodies = [];
    this.staticBodies = [];

    // r-trees
    this.dynamicTree = new RTree();
    this.staticTree = new RTree();

    // processing
    this.updated = false;
    this.pendingDestroy = [];
    this.colliders = [];

    // parameters
    this.stepsRate = 0.5;
  }

  add(body) {
    if (!body.isBody || body.world === this) {
      return;
    }
    if (body.type === DYNAMIC_TYPE) {
      this.dynamicBodies.push(body);
    } else if (body.type === STATIC_TYPE) {
      this.staticBodies.push(body);
      this.staticTree.insert(body);
    }
    body.world = this;
  }

  collide(object1, object2, callback) {
    this.add(object1);
    this.add(object2);
    this.colliders.push(new Collider(this, object1, object2, callback));
  }

  overlap(object1, object2, callback) {
    this.add(object1);
    this.add(object2);
    this.colliders.push(new Collider(this, object1, object2, callback, true));
  }

  update(deltaTime) {
    if (this.dynamicBodies.length === 0) {
      return;
    }
    const bodies = this.dynamicBodies;
    const shouldUpdate = true; // todo: proper logic

    for (let i = 0; i < bodies.length; i++) {
      bodies[i].update(deltaTime);
    }

    if (shouldUpdate) {
      this.updated = true;

      this.dynamicTree.clear();
      this.dynamicTree.load(bodies);

      for (let i = 0; i < this.colliders.length; i++) {
        const collider = this.colliders[i];

        // console.log({collider});

        // collider.update();
      }
    }
  }

  postUpdate() {
    if (this.updated) {
      const bodies = this.dynamicBodies;

      for (let i = 0; i < bodies.length; i++) {
        bodies[i].postUpdate(deltaTime);
      }
    }

    const pending = this.pendingDestroy;

    if (pending.length > 0) {
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
