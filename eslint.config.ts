import { defineConfig, globalIgnores } from 'eslint/config'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import hooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default defineConfig(
  globalIgnores(['dist/', 'coverage/']),
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:'],
            ['^@?\\w'],
            ['^\\.'],
            ['(?:\\.s?css)(?:\\u0000)?$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  { ...jsxA11y.flatConfigs.recommended, files: ['src/**/*.tsx'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': hooks },
    rules: hooks.configs.recommended.rules,
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.*', '**/__mocks__/**', 'src/test/**'],
    rules: { complexity: ['error', { max: 15, variant: 'modified' }] },
  },
)
