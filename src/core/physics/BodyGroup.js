// @flow strict

import {utils} from 'pixi.js';
import Body from '@core/physics/Body';

type IterateeType = (child: Body, index: number, group: BodyGroup) => mixed;

class BodyGroup {
  +isBody: false;
  +isGroup: true;
  +isTiles: false;

  children: Array<Body | BodyGroup>;

  constructor() {
    this.children = [];

    this.isBody = false;
    this.isGroup = true;
    this.isTiles = false;
  }

  add(child: Body | BodyGroup) {
    this.children.push(child);
  }

  remove(child: Body) {
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

  contains(child: Body) {
    for (let index = 0; index < this.children.length; index++) {
      const elem = this.children[index];

      if (elem === child || (elem.isGroup === true && elem.contains(child))) {
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
        result = child.forEach(iteratee);
      } else {
        result = iteratee(child, index, this);
      }
      if (result === false) {
        return false;
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

export default BodyGroup;
