module.exports = {
  setupFiles: ['jest-canvas-mock'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src$1',
    '^@actions(.*)$': '<rootDir>/src/actions$1',
    '^@core(.*)$': '<rootDir>/src/core$1',
    '^@gui(.*)$': '<rootDir>/src/gui$1',
    '^@layers(.*)$': '<rootDir>/src/layers$1',
    '^@levels(.*)$': '<rootDir>/src/levels$1',
    '^@physics(.*)$': '<rootDir>/src/physics$1',
    '^@state(.*)$': '<rootDir>/src/state$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
  },
};
