import {utils} from 'pixi.js';

// bias 0-1
export function blend(hex1, hex2, bias) {
  const rgb1 = utils.hex2rgb(hex1);
  const rgb2 = utils.hex2rgb(hex2);

  return utils.rgb2hex([
    (1 - bias) * rgb1[0] + bias * rgb2[0],
    (1 - bias) * rgb1[1] + bias * rgb2[1],
    (1 - bias) * rgb1[2] + bias * rgb2[2]
  ]);
}
