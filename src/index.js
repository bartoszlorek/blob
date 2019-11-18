import engine from '@app/engine';
import loader from '@app/loader';

import Global from '@models/Global';
import Level from '@models/Level';

import levelSpecs from '@levels';

loader.load(() => {
  const global = new Global({
    assets: loader.resources,
    engine,
  });

  const level = new Level({
    global,
    specs: levelSpecs[0],
  });

  global.load(level);
});
