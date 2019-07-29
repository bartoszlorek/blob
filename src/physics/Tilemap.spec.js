import Tilemap from './Tilemap';

// 0 1 2
// 3 4 5
// 6 7 8

describe('Tilemap()', () => {
  it('adds tiles', () => {
    const map = new Tilemap(3, -1);

    map.add({x: -1, y: -1});
    map.add({x: 1, y: -1});
    map.add({x: 0, y: 0});
    map.add({x: -1, y: 1});
    map.add({x: 1, y: 1});

    expect(map.tiles).toEqual([
      {x: -1, y: -1},
      undefined,
      {x: 1, y: -1},
      undefined,
      {x: 0, y: 0},
      undefined,
      {x: -1, y: 1},
      undefined,
      {x: 1, y: 1}
    ]);
  });

  it('removes tiles', () => {
    const map = new Tilemap(3, -1);

    map.add({x: 0, y: -1});
    map.add({x: 0, y: 0});
    map.add({x: 0, y: 1});

    expect(map.tiles).toEqual([
      undefined,
      {x: 0, y: -1},
      undefined,
      undefined,
      {x: 0, y: 0},
      undefined,
      undefined,
      {x: 0, y: 1}
    ]);

    map.remove({x: 0, y: -1});
    map.remove({x: 0, y: 1});

    expect(map.tiles).toEqual([
      undefined,
      null,
      undefined,
      undefined,
      {x: 0, y: 0},
      undefined,
      undefined,
      null
    ]);
  });

  it('allows to check tiles', () => {
    const map = new Tilemap(3, -1);

    map.add({x: 0, y: 0});
    map.add({x: 0, y: 1});

    expect(map.has(0, 0)).toBe(true);
    expect(map.has(0, 1)).toBe(true);
    expect(map.has(0, -1)).toBe(false);
  });
});
