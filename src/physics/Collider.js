export const colliderType = {
  gravity: 0,
  overlap: 1,
  collide: 2,
};

class Collider {
  constructor({object1, object2, callback, type}) {
    this.object1 = object1;
    this.object2 = object2;
    this.callback = callback;
    this.type = type;

    // flags
    this.isActive = true;
  }

  update(body) {
    if (this.object1 === body || this.object2 === body) {
      this.isActive = body.isAlive;
    } else {
      if (this.object1.isGroup) {
        this._updateGroup(this.object1, body);
      }
      if (this.object2.isGroup) {
        this._updateGroup(this.object2, body);
      }
    }
  }

  _updateGroup(group, body) {
    if (this.isActive) {
      // cleanup group's children
      if (group.contains(body)) {
        group.remove(body);

        if (group.isEmpty()) {
          this.isActive = false;
        }
      }
    } else {
      // maybe it should be enabled again
      if (!group.isEmpty()) {
        this.isActive = true;
      }
    }
  }

  destroy() {
    this.object1 = null;
    this.object2 = null;
    this.callback = null;
  }
}

export default Collider;
