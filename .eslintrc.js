module.exports = {
	env: {
		browser: true,
		es2020: true,
		node: true,
		jest: true,
	},
	extends: [
		'plugin:react/recommended',
		'airbnb',
		'plugin:jest/recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended',
	],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
				paths: ['./'],
			},
		},
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		parserOptions: {
			ecmaVersion: 2020,
		},
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 11,
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint', 'import', 'jsx-a11y', 'prettier'],
	rules: {
		'linebreak-style': 'off', // Неправильно работает в Windows.

		'arrow-parens': 'off', // Несовместимо с prettier
		'object-curly-newline': 'off', // Несовместимо с prettier
		'no-mixed-operators': 'off', // Несовместимо с prettier
		// 'arrow-body-style': 'off', // Это - не наш стиль?
		'function-paren-newline': 'off', // Несовместимо с prettier
		'no-plusplus': 'off',
		'space-before-function-paren': 0, // Несовместимо с prettier

		'max-len': ['error', 130, 2, { ignoreUrls: true }], // airbnb позволяет некоторые пограничные случаи
		'no-console': 'error', // airbnb использует предупреждение
		'no-alert': 'error', // airbnb использует предупреждение

		'no-param-reassign': 'off', // Это - не наш стиль?
		radix: 'off', // parseInt, parseFloat и radix выключены. Мне это не нравится.

		'react/require-default-props': 'off', // airbnb использует уведомление об ошибке
		'react/forbid-prop-types': 'off', // airbnb использует уведомление об ошибке

		'prefer-destructuring': 'off',

		'react/no-find-dom-node': 'off', // Я этого не знаю
		'react/no-did-mount-set-state': 'off',
		'react/no-unused-prop-types': 'off', // Это всё ещё работает нестабильно
		'react/jsx-one-expression-per-line': 'off',

		'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'], specialLink: ['to'] }],
		'jsx-a11y/label-has-for': [
			2,
			{
				required: {
					every: ['id'],
				},
			},
		], // для ошибки вложенных свойств htmlFor элементов label

		'prettier/prettier': ['error'],

		'import/order': [
			'error',
			{
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
				warnOnUnassignedImports: true,
				'newlines-between': 'always-and-inside-groups',
				pathGroups: [
					{
						pattern: '**/*.scss',
						group: 'index',
						position: 'after',
					},
					{
						pattern: './assets/**',
						group: 'sibling',
						position: 'before',
					},
				],
			},
		],

		'import/no-extraneous-dependencies': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'react/jsx-key': 'error',
		'@typescript-eslint/no-var-requires': 'off',
		'react/jsx-no-target-blank': 'error',
		'jsx-a11y/no-static-element-interactions': 'off',
		'react/prop-types': 'off',
		camelcase: 'off',
		indent: [2, 'tab'],
		'react/jsx-indent': [2, 'tab'],
		'react/jsx-indent-props': [2, 'tab'],
		'no-tabs': 'off',
		'import/no-unresolved': 'warn',
		'object-curly-spacing': 'off',
		'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
		'import/extensions': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
		'react/jsx-props-no-spreading': 'off',
		'no-autofocus': 'off',
		'no-underscore-dangle': 'off',
		'jsx-a11y/label-has-associated-control': [2, { assert: 'either', depth: 25 }],
	},
};
