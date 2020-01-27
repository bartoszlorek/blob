import {arrayRemove} from '@utils/array';
import {
  BodyOverlap,
  TileCollision,
  TileGravity,
} from '@core/physics/components';

class World {
  constructor() {
    this.children = [];
    this.components = [];

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
      this.unsafeRemoveChild(this.removeStack[--this.removeIndex]);
    }

    // physics phase
    for (let index = 0; index < this.components.length; index++) {
      const component = this.components[index];
      if (component.isActive) component.validate(deltaTime);
    }
  }

  processChild(child) {
    if (child.isBody) {
      this.children.push(child);
      child.parent = this;
    } else if (child.isGroup) {
      child.forEach(a => this.processChild(a));
    }
  }

  removeChild(child) {
    this.removeStack[this.removeIndex++] = child;
  }

  unsafeRemoveChild(child) {
    this.updateComponents(child);
    arrayRemove(this.children, child);
    child.unsafeDestroy();
  }

  updateComponents(child) {
    for (let index = 0; index < this.components.length; index++) {
      this.components[index].removeActor(child);
    }
  }

  // --------------------------
  // Defined Common Components
  // --------------------------

  collideTile(body, tiles, callback) {
    this.components.push(new TileCollision({body, tiles, callback}));
  }

  gravityTile(body, tiles) {
    this.components.push(new TileGravity({body, tiles}));
  }

  overlapBody(bodyA, bodyB, callback) {
    this.components.push(new BodyOverlap({bodyA, bodyB, callback}));
  }
}

export default World;
