import { configs, plugins } from 'eslint-config-airbnb-extended';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

import js from '@eslint/js';

// 0 - turn the rule off
// 1 - turn the rule on as a warning (doesn't affect exit code)
// 2 - turn the rule on as an error (exit code will be 1)

const prettierOptions = {
  bracketSameLine: false, // Put the > of a multi-line JSX element at the end of the last line instead of being alone on the next line
  jsxSingleQuote: true, // Use single quotes instead of double quotes in JSX
  printWidth: 120, // Specify the line length that the printer will wrap on
  semi: true, // Print semicolons at the ends of statements.
  singleQuote: true, // Use single quotes instead of double quotes.
  tabWidth: 2, // Specify the number of spaces per indentation-level.
  trailingComma: 'all', // Print trailing commas wherever possible when multi-line.
  useTabs: false, // Indent lines with tabs instead of spaces.
  endOfLine: 'lf', // Line Feed only (\n),
  arrowParens: 'avoid', // Include parentheses around a sole arrow function parameter.
  importOrder: ['<THIRD_PARTY_MODULES>', '^@', '^src/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**', 'public/**', 'next-env.d.ts'],
  },

  // Airbnb (eslint-config-airbnb-extended): base + TypeScript + React/Next (hooks, a11y, core-web-vitals)
  js.configs.recommended,
  plugins.stylistic,
  plugins.importX,
  plugins.react,
  plugins.reactA11y,
  plugins.reactHooks,
  plugins.next,
  plugins.typescriptEslint,
  ...configs.base.all,
  ...configs.next.all,

  prettierRecommended,

  {
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],

      // Prettier configuration
      'prettier/prettier': ['error', prettierOptions],

      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },

        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },

        { blankLine: 'always', prev: 'block-like', next: '*' },

        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: 'if', next: '*' },

        { blankLine: 'always', prev: '*', next: 'multiline-expression' },
        { blankLine: 'always', prev: 'multiline-expression', next: '*' },

        { blankLine: 'always', prev: '*', next: 'for' },
        { blankLine: 'always', prev: 'for', next: '*' },

        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },

        { blankLine: 'always', prev: '*', next: 'return' },

        { blankLine: 'always', prev: ['case', 'default'], next: '*' },
      ],

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 1,

      'import-x/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
        },
      ],

      'import-x/no-extraneous-dependencies': 0,
      camelcase: 0,
      'import-x/prefer-default-export': 0,
      'react-hooks/rules-of-hooks': 1,
      'no-param-reassign': 1,
      'react/function-component-definition': 0,
      'react/require-default-props': 0,
      'react/jsx-props-no-spreading': 0,
      'react/jsx-no-bind': 0,
      'react/no-array-index-key': 1,
      'consistent-return': 1,
      'no-plusplus': 1,

      // eslint-config-next used to load after airbnb and downgrade this to a warning
      'react-hooks/exhaustive-deps': 1,

      // New with react-hooks 7 (React Compiler rules): warnings so the upgrade does not change what fails the lint
      'react-hooks/set-state-in-effect': 1,
      'react-hooks/immutability': 1,
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    rules: {
      'no-shadow': 1,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-shadow': 1,

      // unused-imports/no-unused-vars reports these
      '@typescript-eslint/no-unused-vars': 0,

      // New with airbnb-extended's TypeScript rules: warnings so the upgrade does not change what fails the lint
      '@typescript-eslint/no-unnecessary-type-assertion': 1,
      '@typescript-eslint/consistent-indexed-object-style': 1,
      '@typescript-eslint/no-inferrable-types': 1,
      '@typescript-eslint/consistent-type-definitions': 1,
      '@typescript-eslint/no-empty-object-type': 1,
    },
  },
];
