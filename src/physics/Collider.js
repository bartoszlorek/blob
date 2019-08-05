class Collider {
  constructor({world, object1, object2, callback, type, tree}) {
    this.world = world;
    this.object1 = object1;
    this.object2 = object2;
    this.callback = callback;
    this.type = type;
    this.tree = tree;

    // flags
    this.isActive = true;
  }

  destroy() {
    this.world.removeCollider(this);
    this.world = null;
    this.object1 = null;
    this.object2 = null;
    this.callback = null;
  }
}

export default Collider;
