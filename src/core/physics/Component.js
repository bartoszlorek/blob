class Component {
  constructor(props) {
    this.isActive = true;

    this.props = props;
    this.names = [];

    Object.keys(props).forEach(name => {
      if (props[name].isBody || props[name].isGroup) {
        this.names.push(name);
      }
    });
  }

  update(deltaTime) {}

  // todo: update instead of remove only
  validate(actor) {
    for (let i = 0; i < this.names.length; i++) {
      const elem = this.props[this.names[i]];

      if (elem.isGroup) {
        this.validateGroup(elem, actor);
      } else if (elem === actor) {
        this.isActive = false;
      }
    }
  }

  validateGroup(group, actor) {
    if (this.isActive) {
      // disable component with empty group
      if (group.remove(actor) && group.isEmpty()) {
        this.isActive = false;
      }
    } else {
      // enable component with non-empty group
      if (!group.isEmpty()) {
        this.isActive = true;
      }
    }
  }
}

export default Component;
