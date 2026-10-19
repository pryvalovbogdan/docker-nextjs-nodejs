import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 0 - turn the rule off
// 1 - turn the rule on as a warning (doesn't affect exit code)
// 2 - turn the rule on as an error (exit code will be 1)

const prettierOptions = {
  bracketSameLine: false, // Put the > of a multi-line JSX element at the end of the last line instead of being alone on the next line
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
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  prettierRecommended,

  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser, // browser global variables.
        ...globals.node, // Node.js global variables and Node.js-specific rules.
        ...globals.mocha, // adds all of the Mocha testing global variables.
        ...globals.jquery, // jquery global variables.
        ...globals.es2015, // all ECMAScript 6 features.
        ...globals.jest, // jest global variables.
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // Prettier configuration
      'prettier/prettier': ['error', prettierOptions],

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

      // Possible Errors
      'no-extra-semi': 1, // disallow unnecessary semicolons
      'no-inner-declarations': 2, // disallow function or variable declarations in nested blocks

      // Best Practices

      curly: 2, // specify curly brace conventions for all control statements
      'no-eval': 2, // disallow use of eval()
      'no-extend-native': 2, // disallow adding to native types
      'no-new-wrappers': 2, // disallows creating new instances of String, Number, and Boolean
      'no-with': 2, // disallow use of the with statement
      'brace-style': ['error', '1tbs'], // enforce consistent brace style for blocks

      // Variables
      'no-undef': 2, // disallow use of undeclared variables unless mentioned in a /*global */ block
      'no-unused-vars': 1, // disallow unused variables

      // Stylistic Issues
      'array-bracket-spacing': [2, 'never'], // enforce spacing inside array brackets (off by default)

      'no-array-constructor': 2, // disallow use of the Array constructor
      'no-mixed-spaces-and-tabs': 2, // disallow mixed spaces and tabs for indentation
      'no-object-constructor': 2, // disallow use of the Object constructor (replaces the deprecated no-new-object)
      semi: 1, // require or disallow use of semicolons instead of ASI

      // ECMAScript 6

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
      'lines-between-class-members': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 0,
    },
  },
];
