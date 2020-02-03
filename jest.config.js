module.exports = {
  setupFiles: ['jest-canvas-mock'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src$1',
    '^@core(.*)$': '<rootDir>/src/core$1',
    '^@data(.*)$': '<rootDir>/src/data$1',
    '^@layers(.*)$': '<rootDir>/src/layers$1',
    '^@traits(.*)$': '<rootDir>/src/traits$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
  },
};
