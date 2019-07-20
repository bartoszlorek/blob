class Text {
  constructor(name) {
    if (!name) {
      throw 'Text requires name argument';
    }

    this.node = document.createElement('div');
    this.node.className = `text text-${name}`;
  }

  set value(str) {
    this.node.textContent = str;
  }

  get value() {
    return this.node.textContent;
  }
}

export default Text;
