const js = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');
module.exports = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^(next|req|res)$' }],
    },
  },
  {
    ignores: ['node_modules/'],
  },
];
