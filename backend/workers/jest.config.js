module.exports = {
  setupFilesAfterEnv: ['<rootDir>/../test/mocks/layer.mock.js'],
  moduleNameMapper: {
    '^layer/feature/(.*)$': '<rootDir>/../layer/feature/$1',
    '^layer/feature$': '<rootDir>/../layer/feature'
  }
};
