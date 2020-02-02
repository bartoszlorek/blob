// @flow strict

import {utils} from 'pixi.js';

import type BoundingBox from '@core/BoundingBox';

type Child = BoundingBox | Group;

class Group {
  children: Array<Child>;
  isGroup: true;

  constructor() {
    this.children = [];
    this.isGroup = true;
  }

  add(child: Child) {
    this.children.push(child);
  }

  remove(child: Child) {
    for (let index = 0; index < this.children.length; index++) {
      const elem = this.children[index];

      if (elem === child) {
        utils.removeItems(this.children, index, 1);
        return true;
      }

      // $FlowFixMe class-disjoint-unions
      if (elem.isGroup && elem.remove(child)) {
        return true;
      }
    }
    return false;
  }

  contains(child: Child) {
    for (let index = 0; index < this.children.length; index++) {
      const elem = this.children[index];

      // $FlowFixMe class-disjoint-unions
      if (elem === child || (elem.isGroup && elem.contains(child))) {
        return true;
      }
    }
    return false;
  }

  forEach(iteratee: (child: Child, index: number, group: Group) => boolean) {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      let result;

      if (child.isGroup) {
        // $FlowFixMe class-disjoint-unions
        result = child.forEach(iteratee);
      } else {
        result = iteratee(child, index, this);
      }
      if (result === false) {
        return false;
      }
    }
  }

  search(
    bbox: BoundingBox,
    iteratee: (child: Child, index: number, group: Group) => mixed
  ) {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      let result;

      if (child.isGroup) {
        // $FlowFixMe class-disjoint-unions
        result = child.search(bbox, iteratee);
        // $FlowFixMe class-disjoint-unions
      } else if (bbox.intersects(child)) {
        result = iteratee(child, index, this);
      }
      if (result !== undefined) {
        return result;
      }
    }
  }

  isEmpty() {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];

      // $FlowFixMe class-disjoint-unions
      if (!(child.isGroup && child.isEmpty())) {
        return false;
      }
    }
    return true;
  }
}

export default Group;
