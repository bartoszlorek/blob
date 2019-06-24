class Memo {
  constructor() {
    this.entries = {};
  }

  use(name, callback) {
    const entry = this.entries[name];

    if (entry !== undefined) {
      return entry.result;
    }
    const result = callback();
    this.entries[name] = {result};
    return result;
  }

  clear() {
    this.entries = {};
  }
}

export default Memo;
