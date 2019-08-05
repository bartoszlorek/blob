import {mergeArrays} from './array';

describe('mergeArrays()', () => {
  it('should add second array to the first one', () => {
    const first = [1, 2, 3];
    const second = ['a', 'b', 'c'];
    const result = mergeArrays(first, second);

    expect(result).toEqual([1, 2, 3, 'a', 'b', 'c']);
    expect(result.length).toBe(6);
  });
});
