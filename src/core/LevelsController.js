// @flow strict

import type {TiledMapJson} from '@core/structure/TiledMapEditor';

class LevelsController {
  levels: Array<TiledMapJson>;
  levelIndex: number;

  constructor(levels: Array<TiledMapJson>) {
    this.levels = levels;
    this.levelIndex = 0;
  }

  get current() {
    return this.levels[this.levelIndex];
  }

  incrementLevel() {
    if (this.isNextLevel()) {
      this.levelIndex += 1;
      return true;
    }
    return false;
  }

  isNextLevel() {
    return this.levelIndex < this.levels.length - 1;
  }
}

export default LevelsController;
