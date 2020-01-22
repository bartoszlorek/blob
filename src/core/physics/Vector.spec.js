import Vector from './Vector';

describe('Vector()', () => {
  it('should return new vector', () => {
    expect(Vector.create()).toEqual([0, 0]);
  });

  it('should return new immutable vector', () => {
    const vector = Vector.createImmutable();

    expect(() => {
      vector[0] = 10;
    }).toThrow();

    expect(vector).toEqual([0, 0]);
  });
});
