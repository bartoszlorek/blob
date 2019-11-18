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

  // prettier-ignore
  test.each([
    [
      'middle', 3, [1, 1],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ]
    ],
    [
      'top-left', 3, [0, 0],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 0, 0, 0,
        0, 1, 2,
        0, 4, 5 ]
    ],
    [
      'top-left-outside', 3, [-1, -1],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 0, 0, 0,
        0, 0, 0,
        0, 0, 1 ]
    ],
    [
      'top-left-8x8', 4, [1, 1],
      [ 1, 2, 3, 4,
        5, 6, 7, 8,
        9, 1, 2, 3,
        4, 5, 6, 7 ],

      [ 1, 2, 3,
        5, 6, 7,
        9, 1, 2 ],
    ],
    [
      'top-right', 3, [2, 0],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 0, 0, 0,
        2, 3, 0,
        5, 6, 0 ]
    ],
    [
      'top-right-outside', 3, [3, -1],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 0, 0, 0,
        0, 0, 0,
        3, 0, 0 ]
    ],
    [
      'bottom-right', 3, [2, 2],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 5, 6, 0,
        8, 9, 0,
        0, 0, 0 ]
    ],
    [
      'bottom-right-outside', 3, [3, 3],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 9, 0, 0,
        0, 0, 0,
        0, 0, 0 ]
    ],
    [
      'bottom-right-8x8', 4, [2, 2],
      [ 1, 2, 3, 4,
        5, 6, 7, 8,
        9, 1, 2, 3,
        4, 5, 6, 7 ],

      [ 6, 7, 8,
        1, 2, 3,
        5, 6, 7 ],
    ],
    [
      'bottom-left', 3, [0, 2],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 0, 4, 5,
        0, 7, 8,
        0, 0, 0 ]
    ],
    [
      'bottom-left-outside', 3, [-1, 3],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 0, 0, 7,
        0, 0, 0,
        0, 0, 0 ]
    ],
    [
      'outside', 3, [10, 3],
      [ 1, 2, 3,
        4, 5, 6,
        7, 8, 9 ],

      [ 0, 0, 0,
        0, 0, 0,
        0, 0, 0 ]
    ],
    [
      'vertical', 1, [0, 0],
      [ 1,
        2,
        3,
        4,
        5 ],

      [ 0, 0, 0,
        0, 1, 0,
        0, 2, 0 ]
    ],
    [
      'horizontal', 5, [0, 0],
      [ 1, 2, 3, 4, 5 ],

      [ 0, 0, 0,
        0, 1, 2,
        0, 0, 0 ]
    ],
  ])('should return closest values for: %s', (name, width, pos, values, result) => {
    const map = new Tilemap(values, width);
    expect(map.closest(pos[0], pos[1])).toEqual(result);
  });
});
