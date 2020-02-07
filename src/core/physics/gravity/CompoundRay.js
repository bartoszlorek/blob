import {RAY_TYPE} from './Ray';

export const COMPOUND_TYPE = {
  SOLID_SOLID: 0,
  SOLID_BORDER: 1,
  BORDER_BORDER: 2,
};

class CompoundRay {
  constructor(a, b) {
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
