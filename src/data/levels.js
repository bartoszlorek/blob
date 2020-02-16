// @flow strict

import LevelsController from '@core/LevelsController';
import level01 from './level-01.json';
import level02 from './level-02.json';

const levels = new LevelsController([level01, level02]);

export default levels;
