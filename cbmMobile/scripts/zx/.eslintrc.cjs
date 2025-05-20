const path = require('path');

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [path.resolve(__dirname, './tsconfig.json')],
      },
      rules: {
        'unicorn/filename-case': 'off',
      },
    },
  ],
};
