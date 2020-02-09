// @flow strict

class TextElement {
  text: string;
  textNode: Text;
  node: HTMLDivElement;

  constructor(name: string) {
    if (!name) {
      throw 'Text requires name argument';
    }

    this.text = '';
    this.textNode = document.createTextNode('');

    this.node = document.createElement('div');
    this.node.className = `text text-${name}`;
    this.node.appendChild(this.textNode);
  }

  set value(value: string) {
    if (value !== this.text) {
      this.textNode.nodeValue = value;
      this.text = value;
    }
  }

  get value() {
    return this.text;
  }

  set onClick(handler: (event: MouseEvent) => mixed) {
    this.node.classList.add('text--link');
    this.node.onclick = handler;
  }
}

export default TextElement;
