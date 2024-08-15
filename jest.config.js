/** @type {import('jest').Config} */
export default {
    verbose: true,
    testEnvironment: "node",
    coveragePathIgnorePatterns: ["/node_modules/"],
    transform: {},
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testMatch: ['**/tests/**/*.test.js'],

  };