import Tilemap from './Tilemap';

// 0 1 2
// 3 4 5
// 6 7 8

const getTiles = map => {
  return Array.from(map.tiles.entries());
};

describe('Tilemap()', () => {
  it('adds tiles', () => {
    const map = new Tilemap();

    const a = {x: -1, y: -1};
    const b = {x: 1, y: -1};
    const c = {x: 0, y: 0};
    const d = {x: -1, y: 1};
    const e = {x: 1, y: 1};

    map.add(a);
    map.add(b);
    map.add(c);
    map.add(d);
    map.add(e);

    expect(getTiles(map)).toEqual([
      [-14, a],
      [-12, b],
      [0, c],
      [12, d],
      [14, e]
    ]);
  });

  it('removes tiles', () => {
    const map = new Tilemap();

    const a = {x: 0, y: -1};
    const b = {x: 0, y: 0};
    const c = {x: 0, y: 1};

    map.add(a);
    map.add(b);
    map.add(c);

    expect(getTiles(map)).toEqual([[-13, a], [0, b], [13, c]]);

    map.remove(a);
    map.remove(c);

    expect(getTiles(map)).toEqual([[0, b]]);
  });

  it('re-calculates bounds', () => {
    const map = new Tilemap();

    map.add({x: 0, y: 0});
    map.add({x: 1, y: 0});
    map.add({x: 0, y: 1});
    map.add({x: 1, y: 1});

    expect(map.bounds).toEqual({minX: 0, maxX: 1, minY: 0, maxY: 1});

    map.remove({x: 1, y: 1});
    expect(map.bounds).toEqual({minX: 0, maxX: 1, minY: 0, maxY: 1});

    map.remove({x: 0, y: 1});
    expect(map.bounds).toEqual({minX: 0, maxX: 1, minY: 0, maxY: 0});
  });

  it('returns closest tiles for point', () => {
    // 1 1 0
    // 1 X 0
    // 0 X P

    const map = new Tilemap();
    const a = {x: 1, y: 1};
    const b = {x: 1, y: 2};

    map.add({x: 0, y: 0});
    map.add({x: 1, y: 0});
    map.add({x: 0, y: 1});
    map.add(a);
    map.add(b);

    expect(map.closest(2, 2)).toEqual([
      a,
      undefined,
      undefined,
      b,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });

  it('returns null for point outside bounds', () => {
    // 1 1 0
    // 0 0 0
    // 0 0 P

    const map = new Tilemap();
    const a = {x: 0, y: 0};
    const b = {x: 1, y: 0};

    map.add(a);
    map.add(b);

    expect(map.closest(2, 2)).toBe(null);
  });
});
