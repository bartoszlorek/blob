// @flow strict

import engine from '@app/engine';
import loader from '@app/loader';

import Global from '@core/Global';
import Level from '@core/Level';
import Spriteset from '@core/structure/Spriteset';

import level01 from '@data/level-01.json';

loader.load((loader, resources) => {
  const spriteset = new Spriteset(level01, resources);

  const global = new Global(engine);
  const level = new Level(global, spriteset);

  global.load(level);
});
