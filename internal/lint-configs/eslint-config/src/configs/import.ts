/*
  eslint-config/src/configs/import.ts

  说明：import 插件用于规整模块导入风格与检查可能的错误导入。
  要点：
  - 强制 import 顺序/风格以提升可读性
  - 在 monorepo 场景下对 `import/no-unresolved` 适度关闭以兼容工作区解析
*/

import type { Linter } from 'eslint';

import * as pluginImport from 'eslint-plugin-import-x';

export async function importPluginConfig(): Promise<Linter.Config[]> {
	return [
		{
			plugins: {
				// @ts-expect-error - This is a dynamic import
				import: pluginImport,
			},
			rules: {
				// 优先在顶层位置声明类型导出，减少嵌套导致的类型混淆
				'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
				// 导入应集中在文件顶部
				'import/first': 'error',
				// 导入后需换行以增强可读性
				'import/newline-after-import': 'error',
				'import/no-duplicates': 'error',
				'import/no-mutable-exports': 'error',
				'import/no-named-default': 'error',
				'import/no-self-import': 'error',
				// monorepo/webpack/resolver 情况复杂，关闭此规则以避免误报（由打包器处理解析）
				'import/no-unresolved': 'off',
				'import/no-webpack-loader-syntax': 'error',
			},
		},
	];
}
