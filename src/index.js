import engine from '@app/engine';
import loader from '@app/loader';

import Global from '@core/Global';
import Level from '@core/Level';

import {level0Data} from '@data';

loader.load(() => {
  const global = new Global({
    assets: loader.resources,
    engine,
  });

  const level = new Level({
    global,
    data: level0Data,
  });

  global.load(level);
});
