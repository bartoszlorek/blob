import {
  getClosestRay,
  sortPair,
  SOLID_SOLID,
  SOLID_BORDER,
  BORDER_BORDER
} from './gravity';

describe('getClosestRay()', () => {
  const ray1 = {type: 'solid', distance: 3};
  const ray2 = {type: 'solid', distance: 1};
  const ray3 = {type: 'border', distance: 2};
  const ray4 = {type: 'border', distance: 1};

  it('should return closest ray', () => {
    expect(getClosestRay(ray1, ray2, ray3)).toBe(ray2);
  });

  it('should return null for equal rays', () => {
    expect(getClosestRay(ray1, ray2, ray4)).toBe(null);
  });
});

describe('sortPair()', () => {
  const solid1 = {type: 'solid', distance: 3};
  const solid2 = {type: 'solid', distance: 1};
  const border1 = {type: 'border', distance: 2};
  const border2 = {type: 'border', distance: 1};

  it('should return reversed pair solid-border', () => {
    const pair = sortPair(border1, solid1);

    expect(pair[0]).toBe(solid1);
    expect(pair[1]).toBe(border1);
    expect(pair.type).toBe(SOLID_BORDER);
  });

  it('should return pair solid-solid', () => {
    const pair = sortPair(solid1, solid2);

    expect(pair[0]).toBe(solid1);
    expect(pair[1]).toBe(solid2);
    expect(pair.type).toBe(SOLID_SOLID);
  });

  it('should return pair border-border', () => {
    const pair = sortPair(border1, border2);

    expect(pair[0]).toBe(border2);
    expect(pair[1]).toBe(border1);
    expect(pair.type).toBe(BORDER_BORDER);
  });
});
