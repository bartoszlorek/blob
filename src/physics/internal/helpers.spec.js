import {SOLID_SOLID, SOLID_BORDER, BORDER_BORDER} from './types';
import {getShortestRay, sortPair} from './helpers';

describe('getShortestRay()', () => {
  const ray1 = {type: 'solid', distance: 3};
  const ray2 = {type: 'solid', distance: 1};
  const ray3 = {type: 'border', distance: 2};
  const ray4 = {type: 'border', distance: 1};

  it('should return closest ray', () => {
    expect(getShortestRay(ray1, ray2, ray3)).toBe(ray2);
  });

  it('should return null for equal rays', () => {
    expect(getShortestRay(ray1, ray2, ray4)).toBe(null);
  });
});
