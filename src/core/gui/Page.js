// @flow strict

class Page<Props: {}> {
  props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  createFragment() {
    return document.createDocumentFragment();
  }

  render(): HTMLElement | DocumentFragment {
    return this.createFragment();
  }
}

export default Page;
