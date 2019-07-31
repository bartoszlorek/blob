import Bounds from './Bounds';

describe('Bounds()', () => {
  it('adds point', () => {
    const bounds = new Bounds();

    bounds.add(-1, 0);
    bounds.add(0, 0);
    bounds.add(1, 0);

    expect(bounds).toEqual({minX: -1, minY: 0, maxX: 1, maxY: 0});
  });

  it('clears', () => {
    const bounds = new Bounds();

    bounds.add(0, 0);
    bounds.add(1, 0);
    bounds.add(0, 1);
    bounds.add(1, 1);

    expect(bounds).toEqual({minX: 0, minY: 0, maxX: 1, maxY: 1});

    bounds.clear();

    expect(bounds).toEqual({
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    });
  });
});
