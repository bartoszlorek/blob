import Layer from '@models/Layer';

function createEffects({}, global, level) {
  return new Layer('effects');
}

export default createEffects;
