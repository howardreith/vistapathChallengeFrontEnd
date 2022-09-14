module.exports = {
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/utils/styleMock.js',
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.js',
  ],
};
