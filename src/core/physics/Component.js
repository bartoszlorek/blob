// @flow strict

import type Body from '@core/physics/Body';
import type Group from '@core/physics/Group';

class Component<Props: {}> {
  props: Props;
  children: Array<Body | Group>;
  isActive: boolean;

  constructor(props: Props) {
    this.props = props;
    this.children = [];

    // flags
    this.isActive = true;

    // get children from props
    Object.keys(props).forEach(name => {
      const child = props[name];

      if (child.isBody === true || child.isGroup === true) {
        this.children.push(child);
      }
    });
  }

  update(deltaTime: number) {
    // fill in subclass
  }

  validate(body: Body) {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];

      if (child.isGroup === true) {
        this.validateGroup(child, body);
      } else if (child === body) {
        this.isActive = !!body.alive;
      }
    }
  }

  validateGroup(group: Group, body: Body) {
    if (this.isActive) {
      // disable component with empty group
      if (group.remove(body) && group.isEmpty()) {
        this.isActive = false;
      }
    } else {
      // enable component with non-empty group
      if (!group.isEmpty()) {
        this.isActive = true;
      }
    }
  }

  destroy() {
    this.isActive = false;
  }
}

export default Component;
