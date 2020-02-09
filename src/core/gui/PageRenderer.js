// @flow strict

import {fadeIn, fadeOut} from '@utils/dom';
import type Page from './Page';

class PageRenderer {
  root: HTMLElement;
  page: Page<*> | null;

  constructor(rootSelector: string) {
    const root = document.querySelector(rootSelector);

    if (root === null) {
      throw Error('PageRenderer requires root element');
    }
    this.root = root;
    this.page = null;
  }

  render(page: Page<*>) {
    this.clear();
    this.page = page;
    this.root.appendChild(page.render());
    this.root.classList.remove('hidden');
    fadeIn(this.root);
  }

  unmount(callback: () => mixed) {
    fadeOut(this.root, () => {
      this.hidden();
      this.clear();
      callback();
    });
  }

  hidden() {
    this.root.classList.add('hidden');
  }

  clear() {
    this.root.innerHTML = '';
    this.page = null;
  }
}

export default PageRenderer;
