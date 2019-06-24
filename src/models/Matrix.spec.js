import Matrix from './Matrix';

describe('Matrix()', () => {
  it('should set new value', () => {
    const mat = new Matrix(3, 3);
    mat.set(1, 1, true);
    expect(mat.entries[4]).toBe(true);
  });

  it('should get value', () => {
    const mat = new Matrix(3, 3);
    mat.set(1, 2, true);
    expect(mat.n(1, 2)).toBe(true);
  });

  it('should merge multiple matrices', () => {
    const mat0 = new Matrix(3, 3);
    const mat1 = new Matrix(3, 3);
    const mat2 = new Matrix(3, 3);

    mat1.set(0, 0, true);
    mat1.set(1, 1, true);
    mat2.set(2, 2, true);

    mat0.merge(mat1, mat2);
    expect(mat0.n(0, 0)).toBe(true);
    expect(mat0.n(1, 1)).toBe(true);
    expect(mat0.n(2, 2)).toBe(true);
  });
});
