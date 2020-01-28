class Component {
  constructor(props) {
    this.props = props;
    this.children = [];

    // flags
    this.isActive = true;

    // get children from props
    Object.keys(props).forEach(name => {
      const child = props[name];

      if (child.isBody || child.isGroup) {
        this.children.push(child);
      }
    });
  }

  update(deltaTime) {
    // fill in subclass
  }

  validate(body) {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];

      if (child.isGroup) {
        this.validateGroup(child, body);
      } else if (child === body) {
        this.isActive = !!body.isAlive;
      }
    }
  }

  validateGroup(group, body) {
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
    this.props = null;
    this.isActive = false;
  }
}

export default Component;
