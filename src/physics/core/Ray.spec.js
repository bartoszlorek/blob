import Ray, {RAY_TYPE} from './Ray';

describe('Ray()', () => {
  const ray1 = {type: RAY_TYPE.SOLID, length: 3};
  const ray2 = {type: RAY_TYPE.SOLID, length: 1};
  const ray3 = {type: RAY_TYPE.BORDER, length: 2};
  const ray4 = {type: RAY_TYPE.BORDER, length: 1};

  it('should return shorter ray', () => {
    expect(Ray.min(ray1, ray2)).toBe(ray2);
  });

  it('should return null when rays are equal', () => {
    expect(Ray.min(ray2, ray4)).toBe(null);
  });

  it('should combine together', () => {
    expect(Ray.min(Ray.min(ray1, ray2), ray3)).toBe(ray2);
  });
});
