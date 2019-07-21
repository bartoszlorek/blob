class Text {
  constructor(name) {
    if (!name) {
      throw 'Text requires name argument';
    }

    this.text = '';
    this.textNode = document.createTextNode('');

    this.node = document.createElement('div');
    this.node.className = `text text-${name}`;
    this.node.appendChild(this.textNode);
  }

  set value(str) {
    if (str !== this.text) {
      this.textNode.nodeValue = str;
      this.text = str;
    }
  }

  get value() {
    return this.text;
  }
}

export default Text;
