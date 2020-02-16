// @flow strict

import Ray, {RAY_TYPE} from './Ray';

type CompoundRayType = 0 | 1 | 2;

export const COMPOUND_TYPE: {[name: string]: CompoundRayType} = {
  SOLID_SOLID: 0,
  SOLID_BORDER: 1,
  BORDER_BORDER: 2,
};

class CompoundRay {
  a: Ray;
  b: Ray;
  type: CompoundRayType;

  constructor(a: Ray, b: Ray) {
    this.a = a;
    this.b = b;
    this.type = COMPOUND_TYPE.SOLID_SOLID;
  }

  sort() {
    const {a, b} = this;

    if (a.type === RAY_TYPE.SOLID) {
      this.a = a;
      this.b = b;
      this.type =
        b.type === RAY_TYPE.SOLID
          ? COMPOUND_TYPE.SOLID_SOLID
          : COMPOUND_TYPE.SOLID_BORDER;
    } else {
      this.a = b;
      this.b = a;
      this.type =
        b.type === RAY_TYPE.SOLID
          ? COMPOUND_TYPE.SOLID_BORDER
          : COMPOUND_TYPE.BORDER_BORDER;
    }
  }
}

export default CompoundRay;
