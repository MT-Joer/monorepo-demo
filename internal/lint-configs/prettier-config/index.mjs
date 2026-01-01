/*
  prettier-config/index.mjs

  目的：统一代码格式化风格供全仓库使用。
  关键点：
  - 兼容跨平台换行（endOfLine: 'auto'）
  - 为 Tailwind CSS 启用 class 排序插件，减少样式类无意义变动
  - 采用 120 的 printWidth 平衡可读性和紧凑性

  说明：如需覆盖特定 package 的格式，可在该 package 下添加 .prettierrc 或覆盖规则。
*/

export default {
	endOfLine: 'auto',
	overrides: [
		{
			files: ['*.json5'],
			options: {
				quoteProps: 'preserve',
				singleQuote: false,
			},
		},
	],
	plugins: ['prettier-plugin-tailwindcss'],
	printWidth: 120,
	proseWrap: 'never',
	semi: true,
	singleQuote: true,
	trailingComma: 'all',
};
