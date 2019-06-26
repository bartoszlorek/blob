import {isEqual} from '@utils/array';

class Memo {
  constructor() {
    this.entries = {};
  }

  use(name, callback, deps = []) {
    const entry = this.entries[name];

    if (entry !== undefined && isEqual(deps, entry.deps)) {
      return entry.result;
    }
    const result = callback();
    this.entries[name] = {result, deps};
    return result;
  }

  clear() {
    this.entries = {};
  }
}

export default Memo;
