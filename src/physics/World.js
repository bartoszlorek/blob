import RTree from 'rbush';
import Collider from './Collider';

class World {
  constructor() {
    this.bodies = [];
    this.staticBodies = [];

    // r-trees
    this.tree = new RTree();
    this.staticTree = new RTree();

    // processing
    this.updated = false;
    this.colliders = [];

    // parameters
    this.simRate = 0.5;
    this.simFlag = 0;
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
    this.colliders.push(new Collider(this, object1, object2, callback));
  }

  overlap(object1, object2, callback) {
    this.colliders.push(new Collider(this, object1, object2, callback, true));
  }

  gravity(object1, object2, callback) {
    // this.colliders.push(new Collider(this, object1, object2, callback, true));
  }

  update(deltaTime) {
    let index;
    const bodies = this.bodies;
    const staticBodies = this.staticBodies;

    index = bodies.length;
    while (index > 0) {
      bodies[--index].update(deltaTime);
    }

    index = staticBodies.length;
    while (index > 0) {
      staticBodies[--index].update(deltaTime);
    }

    this.simFlag += this.simRate;

    if (this.simFlag >= 1) {
      this.simFlag = 0;

      this.tree.clear();
      this.tree.load(bodies);

      const colliders = this.colliders;
      index = colliders.length;

      while (index > 0) {
        this.resolveCollider(colliders[--index]);
      }
    }
  }

  postUpdate() {
    let index;
    let body;

    const bodies = this.bodies;
    const staticBodies = this.staticBodies;

    index = bodies.length;
    while (index > 0) {
      body = bodies[--index];
      body.postUpdate(deltaTime);

      if (!body.active) {
        this._remove(body);
      }
    }

    index = staticBodies.length;
    while (index > 0) {
      body = staticBodies[--index];
      body.postUpdate(deltaTime);

      if (!body.active) {
        this._remove(body);
      }
    }
  }

  resolveCollider(collider) {
    const {object1, object2, callback} = collider;

    if (object1.isBody && object2.isTilemap) {
      console.log(collider);
    }
  }

  _remove(body) {
    if (body.type === DYNAMIC_TYPE) {
      this.bodies.delete(body);
      this.tree.remove(body);
    } else if (body.type === STATIC_TYPE) {
      this.staticBodies.delete(body);
      this.staticTree.remove(body);
    }
  }
}

export default World;
