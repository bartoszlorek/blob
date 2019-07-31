import Tilemap from './Tilemap';

// 0 1 2
// 3 4 5
// 6 7 8

describe('Tilemap()', () => {
  it('adds tiles', () => {
    const map = new Tilemap(3, -1);

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

    expect(map.tiles).toEqual([
      a,
      undefined,
      b,
      undefined,
      c,
      undefined,
      d,
      undefined,
      e
    ]);
  });

  it('removes tiles', () => {
    const map = new Tilemap(3, -1);

    const a = {x: 0, y: -1};
    const b = {x: 0, y: 0};
    const c = {x: 0, y: 1};

    map.add(a);
    map.add(b);
    map.add(c);

    expect(map.tiles).toEqual([
      undefined,
      a,
      undefined,
      undefined,
      b,
      undefined,
      undefined,
      c
    ]);

    map.remove(a);
    map.remove(c);

    expect(map.tiles).toEqual([
      undefined,
      null,
      undefined,

      undefined,
      b,
      undefined,
      undefined,
      null
    ]);
  });

  it('re-calculates bounds', () => {
    const map = new Tilemap(3);

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

    const map = new Tilemap(3);
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

    const map = new Tilemap(3);
    const a = {x: 0, y: 0};
    const b = {x: 1, y: 0};

    map.add(a);
    map.add(b);

    expect(map.closest(2, 2)).toBe(null);
  });
});
