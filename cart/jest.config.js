export default {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    moduleFileExtensions: ['js', 'json'],
    collectCoverageFrom: ['src/**/*.js', '!src/config/**'],
    testMatch: ['**/__tests__/**/*.test.js'],
    transform: {}
};