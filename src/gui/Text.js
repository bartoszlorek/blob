class Text {
  constructor(name, align = 'left') {
    if (!name) {
      throw 'Text requires name argument';
    }

    this.node = document.createElement('div');
    this.node.className = `text text--align-${align} text-${name}`;
  }

  set value(str) {
    this.node.textContent = str;
  }

  get value() {
    return this.node.textContent;
  }
}

export default Text;
