const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'prettier': prettierPlugin
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn'
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  }
];
