import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import prettierPlugin from 'eslint-plugin-prettier'
import typescriptEslintParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist', 'eslint.config.js', 'vite.config.js', 'scripts/sassPack.js']
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'prettier': prettierPlugin
    },
    rules: {
      'no-async-promise-executor': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-refresh/only-export-components': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      'no-useless-escape': 'off',
      'import/extensions': ['error', 'never', {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never',
        'scss': 'always'
      }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
]
