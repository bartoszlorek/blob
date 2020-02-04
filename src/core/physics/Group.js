// @flow strict

import {utils} from 'pixi.js';
import type Body from '@core/physics/Body';

type IterateeType = (child: Body, index: number, group: Group) => mixed;

class Group {
  +isBody: false;
  +isGroup: true;
  +isTiles: false;

  children: Array<Body | Group>;

  constructor() {
    this.children = [];
    this.isBody = false;
    this.isGroup = true;
    this.isTiles = false;
  }

  add(child: Body | Group) {
    this.children.push(child);
  }

  remove(child: Body | Group) {
    for (let index = 0; index < this.children.length; index++) {
      const elem = this.children[index];

      if (elem === child) {
        utils.removeItems(this.children, index, 1);
        return true;
      }
      if (elem.isGroup === true && elem.remove(child)) {
        return true;
      }
    }
    return false;
  }

  forEach(iteratee: IterateeType) {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      let result;

      if (child.isGroup === true) {
        if (child.forEach(iteratee) === false) {
          return;
        }
      } else if (iteratee(child, index, this) === false) {
        return;
      }
    }
  }

  search(bbox: Body, iteratee: IterateeType) {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      let result;

      if (child.isGroup === true) {
        result = child.search(bbox, iteratee);
      } else if (bbox.intersects(child)) {
        result = iteratee(child, index, this);
      }
      if (result !== undefined) {
        return result;
      }
    }
  }

  contains(child: Body | Group) {
    for (let index = 0; index < this.children.length; index++) {
      const elem = this.children[index];

      if (elem === child || (elem.isGroup === true && elem.contains(child))) {
        return true;
      }
    }
    return false;
  }

  isEmpty() {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];

      if (!(child.isGroup === true && child.isEmpty())) {
        return false;
      }
    }
    return true;
  }
}

export default Group;
