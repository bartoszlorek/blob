// @flow strict

import {fadeInElement, fadeOutElement} from '@utils/dom';
import type Page from './Page';

class PageRenderer {
  root: HTMLElement;

  constructor(rootSelector: string) {
    const root = document.querySelector(rootSelector);

    if (root === null) {
      throw Error('PageRenderer requires root element');
    }
    this.root = root;
  }

  render(page: Page<*>) {
    this.clear();
    this.root.appendChild(page.render(page.props));
    this.root.classList.remove('hidden');
    fadeInElement(this.root);
  }

  unmount(callback?: () => mixed) {
    fadeOutElement(this.root, () => {
      this.hide();
      this.clear();

      if (callback) {
        callback();
      }
    });
  }

  hide() {
    this.root.classList.add('hidden');
  }

  clear() {
    this.root.innerHTML = '';
  }
}

export default PageRenderer;
