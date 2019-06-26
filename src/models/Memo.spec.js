import Memo from './Memo';

describe('Memo()', () => {
  it('should use first memoized result', () => {
    const memo = new Memo();
    const base = jest.fn(() => 'hello');
    const call = jest.fn(() => memo.use('call', base));

    call();
    call();
    call();

    expect(base).toHaveBeenCalledTimes(1);
    expect(call.mock.results).toEqual([
      {type: 'return', value: 'hello'},
      {type: 'return', value: 'hello'},
      {type: 'return', value: 'hello'}
    ]);
  });

  it('should use re-run after clear', () => {
    const memo = new Memo();
    const base = jest
      .fn()
      .mockReturnValueOnce('hello')
      .mockReturnValueOnce('world');

    const call = jest.fn(() => memo.use('call', base));

    call();
    call();

    memo.clear();
    call();

    expect(base).toHaveBeenCalledTimes(2);
    expect(call.mock.results).toEqual([
      {type: 'return', value: 'hello'},
      {type: 'return', value: 'hello'},
      {type: 'return', value: 'world'}
    ]);
  });

  it('should use re-run for diff deps', () => {
    const memo = new Memo();
    const base = jest
      .fn()
      .mockReturnValueOnce('hello')
      .mockReturnValueOnce('world');

    const call = jest.fn(dep => memo.use('call', base, dep));

    call('a');
    call('a');
    call('b');

    expect(base).toHaveBeenCalledTimes(2);
    expect(call.mock.results).toEqual([
      {type: 'return', value: 'hello'},
      {type: 'return', value: 'hello'},
      {type: 'return', value: 'world'}
    ]);
  });
});
