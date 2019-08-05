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

  it('contains child in one of the inner group', () => {
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
});
