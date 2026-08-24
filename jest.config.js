module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 15000,
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/worker.js', '!src/docs/**'],
};
