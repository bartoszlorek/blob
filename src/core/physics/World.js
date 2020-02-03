// @flow strict

import {arrayRemove} from '@utils/array';
import {
  BodyCollision,
  BodyOverlap,
  TileCollision,
  TileGravity,
} from '@core/physics/components';

import type {EdgeType} from '@core/physics/constants';
import type Body from '@core/physics/Body';
import type Component from '@core/physics/Component';
import type Group from '@core/structure/Group';

class World {
  children: Array<Body>;
  components: Array<Component<any>>;

  removeStack: Array<Body>;
  removeIndex: number;

  constructor() {
    this.children = [];
    this.components = [];

    // processing
    this.removeStack = [];
    this.removeIndex = 0;
  }

  update(deltaTime: number) {
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
      if (component.isActive) component.update(deltaTime);
    }
  }

  processChild(child: Body | Group) {
    if (child.isBody) {
      // $FlowFixMe class-disjoint-unions
      this.children.push(child);
      // $FlowFixMe class-disjoint-unions
      child.parent = this;
    } else if (child.isGroup) {
      // $FlowFixMe class-disjoint-unions
      child.forEach(a => this.processChild(a));
    }
  }

  removeChild(child: Body) {
    this.removeStack[this.removeIndex++] = child;
    child.isAlive = false;
  }

  unsafeRemoveChild(child: Body) {
    this.validateComponents(child);
    arrayRemove(this.children, child);
    child.unsafeDestroy();
  }

  validateComponents(child: Body) {
    for (let index = 0; index < this.components.length; index++) {
      this.components[index].validate(child);
    }
  }

  // --------------------------
  // Defined Common Components
  // --------------------------

  collideTile(props: $PropertyType<TileCollision, 'props'>) {
    this.components.push(new TileCollision(props));
  }

  gravityTile(props: $PropertyType<TileGravity, 'props'>) {
    this.components.push(new TileGravity(props));
  }

  collideBody(props: $PropertyType<BodyCollision, 'props'>) {
    this.components.push(new BodyCollision(props));
  }

  overlapBody(props: $PropertyType<BodyOverlap, 'props'>) {
    this.components.push(new BodyOverlap(props));
  }
}

export default World;
