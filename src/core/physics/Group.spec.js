import Group from './Group';

describe('Group()', () => {
  it('should add child', () => {
    const group = new Group();
    const child = {value: 1};

    group.add(child);
    expect(group.children).toEqual([child]);
  });

  it('should remove child', () => {
    const group = new Group();
    const child = {value: 1};

    group.add(child);
    group.remove(child);
    expect(group.children).toEqual([]);
  });

  it('should remove deep child', () => {
    const master = new Group();
    const group = new Group();
    const child1 = {value: 1};
    const child2 = {value: 2};

    group.add(child2);
    master.add(child1);
    master.add(group);

    master.remove(child2);
    expect(master.children).toEqual([child1, group]);
    expect(group.children).toEqual([]);
  });

  it('should return true when contains child', () => {
    const group = new Group();
    const child = {value: 1};

    group.add(child);
    expect(group.contains(child)).toBe(true);
  });

  it('should add group', () => {
    const master = new Group();
    const group = new Group();

    master.add(group);
    expect(master.children).toEqual([group]);
  });

  it('should remove group', () => {
    const master = new Group();
    const group = new Group();

    master.add(group);
    master.remove(group);
    expect(master.children).toEqual([]);
  });

  it('should return true when contains deep child', () => {
    const master = new Group();
    const group1 = new Group();
    const group2 = new Group();
    const child1 = {value: 1};
    const child2 = {value: 2};

    group2.add(child2);

    master.add(child1);
    master.add(group1);
    master.add(group2);

    expect(master.contains(child2)).toBe(true);
  });

  it('should loop over every child inside', () => {
    const master = new Group();
    const group1 = new Group();
    const group2 = new Group();
    const child1 = {value: 1};
    const child2 = {value: 2};

    group2.add(child2);

    master.add(child1);
    master.add(group1);
    master.add(group2);

    const callback = jest.fn();
    master.forEach(callback);

    expect(callback.mock.calls).toEqual([
      [child1, 0, master],
      [child2, 1, group2],
    ]);
  });

  it('returns true when is shallowly empty', () => {
    const group = new Group();
    expect(group.isEmpty()).toBe(true);
  });

  it('returns true when is deeply empty', () => {
    const master = new Group();
    const group = new Group();

    master.add(group);
    expect(master.isEmpty()).toBe(true);
  });

  it('returns false when is not shallowly empty', () => {
    const group = new Group();
    const child = {value: 1};

    group.add(child);
    expect(group.isEmpty()).toBe(false);
  });

  it('returns false when is not deeply empty', () => {
    const master = new Group();
    const group = new Group();
    const child = {value: 1};

    group.add(child);
    master.add(group);
    expect(master.isEmpty()).toBe(false);
  });

  it('returns false when group with children is not only first', () => {
    const master = new Group();
    const groupA = new Group();
    const groupB = new Group();

    groupB.add('value');
    master.add(groupA);
    master.add(groupB);
    expect(master.isEmpty()).toBe(false);
  });

  it('returns true when all children groups are empty', () => {
    const master = new Group();
    const groupA = new Group();
    const groupB = new Group();

    master.add(groupA);
    master.add(groupB);
    expect(master.isEmpty()).toBe(true);
  });
});
