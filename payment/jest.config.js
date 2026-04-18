export default {
    testEnvironment: 'node',
    transform: {},
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testMatch: [
        '<rootDir>/__tests__/**/*.test.js',
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/db.js',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};