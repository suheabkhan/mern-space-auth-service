/* eslint-env node */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        //This property is to avoid clash between eslint and prettier, after installing the npm dependency
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    root: true,
    rules: {
        'no-console': 'error',
        'dot-notation': 'error',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/require-await': 'off',
    },
};
