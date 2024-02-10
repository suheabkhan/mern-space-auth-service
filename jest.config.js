/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    // do u want the code coverage
    collectCoverage: true,
    //node is v8 engine
    coverageProvider: 'v8',
    //collect coverage from which files, basically from scr folder and dont include tests and node_modules
    collectCoverageFrom: [
        'src/**/*.ts',
        '!tests/**/*.spec.ts',
        '!**/node_modules/**',
    ],
};
