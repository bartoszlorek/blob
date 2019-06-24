import {utils} from 'pixi.js';
import {blend} from './color';

describe('blend()', () => {
  const white = 0xffffff;
  const black = 0x000000;

  it('should return 50% grey color', () => {
    const result = blend(white, black, 0.5);
    expect(utils.hex2string(result)).toBe('#7f7f7f');
  });

  it('should return 100% black color', () => {
    const result = blend(white, black, 1);
    expect(utils.hex2string(result)).toBe('#000000');
  });
});
