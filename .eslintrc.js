module.exports = {
	'rules': {
			'quotes': [1, 'single'],
			'semi': [1, 'always'],
			'strict': [1, 'global'],
			'indent': [1, 'tab', {
				'SwitchCase': 1,
				'VariableDeclarator': 0,
				'CallExpression': { 'arguments': 1 },
			}],
			'no-whitespace-before-property': 2,
			'keyword-spacing': [1, {
				before: true,
				after: true,
				overrides: { 'switch': { after: false } }
			}],
			'array-bracket-spacing': [1, 'never'],
			'object-curly-spacing': [1, 'always'],
			'space-before-function-paren': [1, 'never'],
			'no-console': 1,
			'no-debugger': 1,
			'no-extra-semi': 1,
			'semi-spacing': 1,
			'no-unneeded-ternary': 1,
			'no-mixed-spaces-and-tabs': [1, 'smart-tabs'],
	}
};
