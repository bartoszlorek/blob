import Tilemap from './Tilemap';

describe('Tilemap()', () => {
  it('should create from array of values', () => {
    const map = new Tilemap([1, 0, 1], 3);
    expect(map.values).toEqual([1, 0, 1]);
  });

  it('should return index', () => {
    const map = new Tilemap([1, 0, 1, 1], 2);
    expect(map.getIndex(1, 1)).toBe(3);
  });

  it('should remove value by index', () => {
    const map = new Tilemap([1, 0, 1], 3);
    map.removeByIndex(2);
    expect(map.values).toEqual([1, 0, 0]);
  });

  it('should calculate bounds', () => {
    const map = new Tilemap([1, 0, 1, 1], 4);

    expect(map.bounds).toEqual({
      minX: 0,
      maxX: 3,
      minY: 0,
      maxY: 0,
    });
  });

  it('should re-calculate bounds', () => {
    const map = new Tilemap([1, 0, 1, 1], 4);

    map.removeByIndex(0);
    expect(map.bounds).toEqual({
      minX: 2,
      maxX: 3,
      minY: 0,
      maxY: 0,
    });
  });

  describe('closest()', () => {
    // prettier-ignore
    const values3 = [
      1, 2, 3,
      4, 5, 6,
      7, 8, 9
    ];

    // prettier-ignore
    test.each([
      [
        'middle', [1, 1],
        [ 1, 2, 3,
          4, 5, 6,
          7, 8, 9 ]
      ],
      [
        'top-left-corner', [0, 0],
        [ 0, 0, 0,
          0, 1, 2,
          0, 4, 5 ]
      ],
      [
        'top-left-outside', [-1, -1],
        [ 0, 0, 0,
          0, 0, 0,
          0, 0, 1 ]
      ],
      [
        'top-right-corner', [2, 0],
        [ 0, 0, 0,
          2, 3, 0,
          5, 6, 0 ]
      ],
      [
        'top-right-outside', [3, -1],
        [ 0, 0, 0,
          0, 0, 0,
          3, 0, 0 ]
      ],
      [
        'bottom-right-corner', [2, 2],
        [ 5, 6, 0,
          8, 9, 0,
          0, 0, 0 ]
      ],
      [
        'bottom-right-outside', [3, 3],
        [ 9, 0, 0,
          0, 0, 0,
          0, 0, 0 ]
      ],
      
      [
        'bottom-left-corner', [0, 2],
        [ 0, 4, 5,
          0, 7, 8,
          0, 0, 0 ]
      ],
      [
        'bottom-left-outside', [-1, 3],
        [ 0, 0, 7,
          0, 0, 0,
          0, 0, 0 ]
      ],
      [
        'outside', [10, 3],
        [ 0, 0, 0,
          0, 0, 0,
          0, 0, 0 ]
      ],
    ])('return closest values from 3x3 for %s', (name, [x, y], result) => {
      const map = new Tilemap(values3, 3);
      expect(map.closest(x, y)).toEqual(result);
    });

    // prettier-ignore
    const values4 = [
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 1, 2, 3,
      4, 5, 6, 7
    ];

    // prettier-ignore
    test.each([
      [
        'top-left-corner', [1, 1],
        [ 1, 2, 3,
          5, 6, 7,
          9, 1, 2 ]
        ],
      [
        'bottom-right-corner', [2, 2],
        [ 6, 7, 8,
          1, 2, 3,
          5, 6, 7 ]
      ],
    ])('return closest values from 4x4 for %s', (name, [x, y], result) => {
      const map = new Tilemap(values4, 4);
      expect(map.closest(x, y)).toEqual(result);
    });

    it('return closest values for vertical', () => {
      // prettier-ignore
      const map = new Tilemap([
        1,
        2,
        3,
        4,
        5
      ], 1);

      // prettier-ignore
      expect(map.closest(0, 0)).toEqual([
        0, 0, 0,
        0, 1, 0,
        0, 2, 0
      ]);
    });

    it('return closest values for horizontal', () => {
      const map = new Tilemap([1, 2, 3, 4, 5], 5);

      // prettier-ignore
      expect(map.closest(0, 0)).toEqual([
        0, 0, 0,
        0, 1, 2,
        0, 0, 0
      ]);
    });
  });

  describe('raycast()', () => {
    const dir = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    };

    // prettier-ignore
    const uValues = [
      1, 0, 3,
      4, 0, 6,
      7, 8, 9
    ];

    // →
    //   1  0  3 ↓
    //   4  0  6
    //   7  8  9
    // ↑       ←

    test.each`
      name       | xy          | dxy          | result
      ${'up'}    | ${[-1, 3]}  | ${dir.up}    | ${-1}
      ${'down'}  | ${[3, 0]}   | ${dir.down}  | ${-1}
      ${'left'}  | ${[2, 3]}   | ${dir.left}  | ${-1}
      ${'right'} | ${[-1, -1]} | ${dir.right} | ${-1}
    `(
      'should return $result for rays that will miss map going $name',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(uValues, 3);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );

    //      ↑
    //   1, 0, 3
    // ← 4  0  6 →
    //   7  8  9
    //      ↓

    test.each`
      name       | xy         | dxy          | result
      ${'up'}    | ${[1, -1]} | ${dir.up}    | ${-1}
      ${'down'}  | ${[1, 3]}  | ${dir.down}  | ${-1}
      ${'left'}  | ${[-1, 1]} | ${dir.left}  | ${-1}
      ${'right'} | ${[3, 1]}  | ${dir.right} | ${-1}
    `(
      'should return $result for rays going $name out-out map',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(uValues, 3);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );

    // prettier-ignore
    const xValues = [
      1, 0, 3,
      0, 5, 0,
      7, 0, 9
    ];

    //      ↓
    //   1  0  3
    // → 0  5  0 ←
    //   7  0  9
    //      ↑

    test.each`
      name       | xy         | dxy          | result
      ${'up'}    | ${[1, 3]}  | ${dir.up}    | ${2}
      ${'down'}  | ${[1, -1]} | ${dir.down}  | ${2}
      ${'left'}  | ${[3, 1]}  | ${dir.left}  | ${2}
      ${'right'} | ${[-1, 1]} | ${dir.right} | ${2}
    `(
      'should return $result for rays going $name out-in map',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(xValues, 3);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );

    // prettier-ignore
    const throughValues = [
      1, 0, 3,
      0, 0, 0,
      7, 0, 9
    ];

    //      ↓
    //   1  0  3
    // → 0  0  0 ←
    //   7  0  9
    //      ↑

    test.each`
      name       | xy         | dxy          | result
      ${'up'}    | ${[1, 3]}  | ${dir.up}    | ${-1}
      ${'down'}  | ${[1, -1]} | ${dir.down}  | ${-1}
      ${'left'}  | ${[3, 1]}  | ${dir.left}  | ${-1}
      ${'right'} | ${[-1, 1]} | ${dir.right} | ${-1}
    `(
      'should return $result for rays going $name and through map',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(throughValues, 3);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );

    // prettier-ignore
    const plusValues = [
      0, 0, 1, 0, 0,
      0, 0, 2, 0, 0,
      3, 4, 5, 6, 7,
      0, 0, 8, 0, 0,
      0, 0, 9, 0, 0
    ];

    // 0  ↓  1  0  0
    // →  0  2  0  0
    // 3  4  5  6  7
    // 0  0  8  0  ←
    // 0  0  9  ↑  0

    test.each`
      name       | xy        | dxy          | result
      ${'up'}    | ${[3, 4]} | ${dir.up}    | ${2}
      ${'down'}  | ${[1, 0]} | ${dir.down}  | ${2}
      ${'left'}  | ${[4, 3]} | ${dir.left}  | ${2}
      ${'right'} | ${[0, 1]} | ${dir.right} | ${2}
    `(
      'should return $result for rays going $name inside map',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(plusValues, 5);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );

    // 0  0  1  0  0
    // ←  ↑  2  0  0
    // 3  4  5  6  7
    // 0  0  8  ↓  →
    // 0  0  9  0  0

    test.each`
      name       | xy        | dxy          | result
      ${'up'}    | ${[1, 1]} | ${dir.up}    | ${-1}
      ${'down'}  | ${[3, 3]} | ${dir.down}  | ${-1}
      ${'left'}  | ${[0, 1]} | ${dir.left}  | ${-1}
      ${'right'} | ${[4, 3]} | ${dir.right} | ${-1}
    `(
      'should return $result for rays going $name in-out map',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(plusValues, 5);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );
  });
});
