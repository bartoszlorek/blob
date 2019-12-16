import {isCornerCase} from './helpers';

describe('isCornerCase()', () => {
  it('should return closest ray', () => {
    expect(getShortestRay(ray1, ray2, ray3)).toBe(ray2);
  });

  it('should return null for equal rays', () => {
    expect(getShortestRay(ray1, ray2, ray4)).toBe(null);
  });
});
