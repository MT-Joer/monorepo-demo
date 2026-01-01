/*
  stylelint-config/index.mjs

  目的：为仓库样式（CSS/SCSS/vue style blocks）提供一致的校验与声明顺序规则。
  关键点：
  - 使用 standard + recess-order 保证声明顺序与基础校验
  - 对 .vue/.html/.scss 使用不同的 customSyntax 以正确解析内联样式与 SCSS 特性
  - 与 prettier 协同（stylelint-prettier）让 prettier 负责格式化细节

  说明：该配置忽略 JS/TS/JSON/MD 等非样式文件；若特定 package 有特殊需求，可以在该 package 内覆写。
*/

export default {
	extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
	ignoreFiles: [
		'**/*.js',
		'**/*.jsx',
		'**/*.tsx',
		'**/*.ts',
		'**/*.json',
		'**/*.md',
	],
	overrides: [
		{
			customSyntax: 'postcss-html',
			files: ['*.(html|vue)', '**/*.(html|vue)'],
			rules: {
				'selector-pseudo-class-no-unknown': [
					true,
					{
						ignorePseudoClasses: ['global', 'deep'],
					},
				],
				'selector-pseudo-element-no-unknown': [
					true,
					{
						ignorePseudoElements: [
							'v-deep',
							'v-global',
							'v-slotted',
						],
					},
				],
			},
		},
		{
			customSyntax: 'postcss-scss',
			extends: [
				'stylelint-config-recommended-scss',
				'stylelint-config-recommended-vue/scss',
			],
			files: ['*.scss', '**/*.scss'],
		},
	],
	plugins: [
		'stylelint-order',
		'@stylistic/stylelint-plugin',
		'stylelint-prettier',
		'stylelint-scss',
	],
	rules: {
		'at-rule-no-deprecated': null,
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'extends',
					'ignores',
					'include',
					'mixin',
					'if',
					'else',
					'media',
					'for',
					'at-root',
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
					'function',
					'each',
					'use',
					'forward',
					'return',
				],
			},
		],
		'font-family-no-missing-generic-family-keyword': null,
		'function-no-unknown': null,
		'import-notation': null,
		'media-feature-range-notation': null,
		'named-grid-areas-no-invalid': null,
		'no-descending-specificity': null,
		'no-empty-source': null,
		'order/order': [
			[
				'dollar-variables',
				'custom-properties',
				'at-rules',
				'declarations',
				{
					name: 'supports',
					type: 'at-rule',
				},
				{
					name: 'media',
					type: 'at-rule',
				},
				{
					name: 'include',
					type: 'at-rule',
				},
				'rules',
			],
			{ severity: 'error' },
		],
		'prettier/prettier': true,
		'rule-empty-line-before': [
			'always',
			{
				ignore: ['after-comment', 'first-nested'],
			},
		],
		'scss/at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'extends',
					'ignores',
					'include',
					'mixin',
					'if',
					'else',
					'media',
					'for',
					'at-root',
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
					'function',
					'each',
					'use',
					'forward',
					'return',
				],
			},
		],
		'scss/operator-no-newline-after': null,
		'selector-class-pattern':
			'^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:[.+])?$',

		'selector-not-notation': null,
	},
};
