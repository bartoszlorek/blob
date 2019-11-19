import CompoundRay, {COMPOUND_TYPE} from './CompoundRay';

describe('CompoundRay()', () => {
  const solid1 = {type: COMPOUND_TYPE.SOLID_SOLID};
  const solid2 = {type: COMPOUND_TYPE.SOLID_SOLID};
  const border1 = {type: COMPOUND_TYPE.SOLID_BORDER};
  const border2 = {type: COMPOUND_TYPE.SOLID_BORDER};

  it('should reverse solid-border pair', () => {
    const comp = new CompoundRay(border1, solid1);

    comp.sort();

    expect(comp.a).toBe(solid1);
    expect(comp.b).toBe(border1);
    expect(comp.type).toBe(COMPOUND_TYPE.SOLID_BORDER);
  });

  it('should not reverse solid-solid pair', () => {
    const comp = new CompoundRay(solid1, solid2);

    comp.sort();

    expect(comp.a).toBe(solid1);
    expect(comp.b).toBe(solid2);
    expect(comp.type).toBe(COMPOUND_TYPE.SOLID_SOLID);
  });

  it('can reverse border-border pair', () => {
    const comp = new CompoundRay(border1, border2);

    comp.sort();

    expect(comp.a).toBe(border2);
    expect(comp.b).toBe(border1);
    expect(comp.type).toBe(COMPOUND_TYPE.BORDER_BORDER);
  });
});
