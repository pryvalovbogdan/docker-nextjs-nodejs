module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir : __dirname,
		sourceType: 'module',
	},
	extends: [
		'airbnb',
		'airbnb/hooks',
		'plugin:prettier/recommended',
		'next/core-web-vitals',
	],
	plugins: [
		"react",
		"prettier",
		"unused-imports"
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],

		// 0 - turn the rule off
		// 1 - turn the rule on as a warning (doesn't affect exit code)
		// 2 - turn the rule on as an error (exit code will be 1)

		// Prettier configuration
		"prettier/prettier": ["error", {
			"bracketSameLine": false,     // Put the > of a multi-line JSX element at the end of the last line instead of being alone on the next line
			"jsxSingleQuote": true,       // Use single quotes instead of double quotes in JSX
			"printWidth": 120,            // Specify the line length that the printer will wrap on
			"semi": true,                 // Print semicolons at the ends of statements.
			"singleQuote": true,          // Use single quotes instead of double quotes.
			"tabWidth": 2,                // Specify the number of spaces per indentation-level.
			"trailingComma": "all",       // Print trailing commas wherever possible when multi-line.
			"useTabs": false,             // Indent lines with tabs instead of spaces.
			"endOfLine": "lf",            // Line Feed only (\n),
			"arrowParens": "avoid",        // Include parentheses around a sole arrow function parameter.
			"importOrder": ["<THIRD_PARTY_MODULES>", "^@", "^src/(.*)$",  "^[./]"],
			"importOrderSeparation": true,
			"importOrderSortSpecifiers": true,
			"plugins": ["@trivago/prettier-plugin-sort-imports"]
		}],

		"padding-line-between-statements": [ "error",
			{ "blankLine": "always", "prev": ["const", "let", "var"], "next": "*"},
			{ "blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"]},

			{ "blankLine": "always", "prev": "import", "next": "*" },
			{ "blankLine": "any", "prev": "import", "next": "import" },

			{ "blankLine": "always", "prev": "block-like", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "if" },
			{ "blankLine": "always", "prev": "if", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "multiline-expression" },
			{ "blankLine": "always", "prev": "multiline-expression", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "for" },
			{ "blankLine": "always", "prev": "for", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "function" },
			{ "blankLine": "always", "prev": "function", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "return" },

			{ "blankLine": "always", "prev": ["case", "default"], "next": "*" }
		],

		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{
				"vars": "all",
				"varsIgnorePattern": "^_",
				"args": "after-used",
				"argsIgnorePattern": "^_"
			}
		],
		"prefer-const": 1,

		'import/extensions': [
			'error',
			'ignorePackages',
			{
				ts: 'never',
				tsx: 'never',
			},
		],

		"import/no-extraneous-dependencies": 0,
		"camelcase": 0,
		"import/prefer-default-export": 0,
		"react-hooks/rules-of-hooks": 1,
		"no-param-reassign": 1,
		"react/function-component-definition": 0,
		"react/require-default-props": 0,
		"react/jsx-props-no-spreading": 0,
		"react/jsx-no-bind": 0,
		"no-shadow": 1,
		"react/no-array-index-key": 1,
		"consistent-return": 1
	},
	settings: {
		"import/resolver": {
			"node": {
				"extensions": [".js", ".jsx", ".ts", ".tsx", ".json", ".module.css"]
			},
			typescript: {
				alwaysTryTypes: true,
				project: './tsconfig.json',
			},
		}
	},
};
