// @flow strict

import {utils} from 'pixi.js';

import Body from '@core/physics/Body';

class Group {
  children: Array<Body | Group>;
  isGroup: true;

  constructor() {
    this.children = [];
    this.isGroup = true;
  }

  add(child: Body | Group) {
    this.children.push(child);
  }

  remove(child: Body) {
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

  contains(child: Body) {
    for (let index = 0; index < this.children.length; index++) {
      const elem = this.children[index];

      // $FlowFixMe class-disjoint-unions
      if (elem === child || (elem.isGroup && elem.contains(child))) {
        return true;
      }
    }
    return false;
  }

  forEach(iteratee: (child: Body, index: number, group: Group) => boolean) {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      let result;

      if (child.isGroup) {
        // $FlowFixMe class-disjoint-unions
        result = child.forEach(iteratee);
      } else {
        // $FlowFixMe class-disjoint-unions
        result = iteratee(child, index, this);
      }
      if (result === false) {
        return false;
      }
    }
  }

  search(
    bbox: Body,
    iteratee: (child: Body, index: number, group: Group) => mixed
  ) {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      let result;

      if (child.isGroup) {
        // $FlowFixMe class-disjoint-unions
        result = child.search(bbox, iteratee);
        // $FlowFixMe class-disjoint-unions
      } else if (bbox.intersects(child)) {
        // $FlowFixMe class-disjoint-unions
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
