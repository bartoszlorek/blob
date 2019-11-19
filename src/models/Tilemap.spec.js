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
    const values4 = [
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 1, 2, 3,
      4, 5, 6, 7
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
    // prettier-ignore
    const valuesVase = [
      1, 0, 3,
      4, 0, 6,
      7, 8, 9
    ];

    // prettier-ignore
    const valuesThrough = [
      1, 0, 3,
      0, 0, 0,
      7, 0, 9
    ];

    test.each`
      name       | xy        | dxy        | result
      ${'up'}    | ${[1, 1]} | ${[0, -1]} | ${-1}
      ${'down'}  | ${[1, 1]} | ${[0, 1]}  | ${1}
      ${'left'}  | ${[1, 1]} | ${[-1, 0]} | ${1}
      ${'right'} | ${[1, 1]} | ${[1, 0]}  | ${1}
    `(
      'returns length of ray in `vase` shape for $name',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(valuesVase, 3);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );

    test.each`
      name       | xy         | dxy        | result
      ${'up'}    | ${[1, 4]}  | ${[0, -1]} | ${2}
      ${'down'}  | ${[1, -2]} | ${[0, 1]}  | ${4}
      ${'left'}  | ${[4, 1]}  | ${[-1, 0]} | ${2}
      ${'right'} | ${[-2, 1]} | ${[1, 0]}  | ${2}
    `(
      'returns length of ray outside `vase` shape for $name',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(valuesVase, 3);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );

    test.each`
      name       | xy        | dxy        | result
      ${'up'}    | ${[1, 1]} | ${[0, -1]} | ${-1}
      ${'down'}  | ${[1, 1]} | ${[0, 1]}  | ${-1}
      ${'left'}  | ${[1, 1]} | ${[-1, 0]} | ${-1}
      ${'right'} | ${[1, 1]} | ${[1, 0]}  | ${-1}
    `(
      'returns length of ray `through` shape for $name',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(valuesThrough, 3);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );

    // x1
    //    1, 0, 3 x2
    //    0, 0, 0
    // x3 7, 0, 9
    //            x4

    test.each`
      name          | xy          | dxy        | result
      ${'up-x3'}    | ${[-1, 2]}  | ${[0, -1]} | ${-1}
      ${'up-x4'}    | ${[3, 3]}   | ${[0, -1]} | ${-1}
      ${'down-x1'}  | ${[-1, -1]} | ${[0, 1]}  | ${-1}
      ${'down-x2'}  | ${[3, 0]}   | ${[0, 1]}  | ${-1}
      ${'left-x3'}  | ${[-1, 2]}  | ${[-1, 0]} | ${-1}
      ${'left-x4'}  | ${[3, 3]}   | ${[-1, 0]} | ${-1}
      ${'right-x1'} | ${[-1, -1]} | ${[1, 0]}  | ${-1}
      ${'right-x2'} | ${[3, 0]}   | ${[1, 0]}  | ${-1}
    `(
      'returns length of ray `missing outside` for $name',
      ({xy: [x, y], dxy: [dx, dy], result}) => {
        const map = new Tilemap(valuesVase, 3);
        expect(map.raycast(x, y, dx, dy)).toBe(result);
      }
    );
  });
});
