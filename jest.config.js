module.exports = {
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@gui(.*)$': '<rootDir>/src/gui$1',
    '^@layers(.*)$': '<rootDir>/src/layers$1',
    '^@levels(.*)$': '<rootDir>/src/levels$1',
    '^@models(.*)$': '<rootDir>/src/models$1',
    '^@state(.*)$': '<rootDir>/src/state$1',
    '^@traits(.*)$': '<rootDir>/src/traits$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1'
  }
};
