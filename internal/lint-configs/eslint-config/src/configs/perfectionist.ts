/*
  eslint-config/src/configs/perfectionist.ts

  说明：Perfectionist 插件用于强制排序（imports、exports、对象等）以减少无意义变动。
  要点：
  - 对 import 进行多维度排序（type/external/vue/vben/internal 等分组）
  - 对 export 和 named-export 进行排序
  - 对 objects 默认关闭以保留语义顺序，可按需在 custom-config 中调整
*/

import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function perfectionist(): Promise<Linter.Config[]> {
	const perfectionistPlugin = await interopDefault(import('eslint-plugin-perfectionist'));

	return [
		perfectionistPlugin.configs['recommended-natural'],
		{
			rules: {
				'perfectionist/sort-exports': [
					'error',
					{
						order: 'asc',
						type: 'natural',
					},
				],
				'perfectionist/sort-imports': [
					'error',
					{
						customGroups: {
							type: {
								'vben-core-type': ['^@vben-core/.+'],
								'vben-type': ['^@vben/.+'],
								'vue-type': ['^vue$', '^vue-.+', '^@vue/.+'],
							},
							value: {
								vben: ['^@vben/.+'],
								'vben-core': ['^@vben-core/.+'],
								vue: ['^vue$', '^vue-.+', '^@vue/.+'],
							},
						},
						environment: 'node',
						groups: [
							['external-type', 'builtin-type', 'type'],
							'vue-type',
							'vben-type',
							'vben-core-type',
							['parent-type', 'sibling-type', 'index-type'],
							['internal-type'],
							'builtin',
							'vue',
							'vben',
							'vben-core',
							'external',
							'internal',
							['parent', 'sibling', 'index'],
							'side-effect',
							'side-effect-style',
							'style',
							'object',
							'unknown',
						],
						internalPattern: ['^#/.+'],
						newlinesBetween: 'always',
						order: 'asc',
						type: 'natural',
					},
				],
				'perfectionist/sort-modules': 'off',
				'perfectionist/sort-named-exports': [
					'error',
					{
						order: 'asc',
						type: 'natural',
					},
				],
				'perfectionist/sort-objects': [
					'off',
					{
						customGroups: {
							items: 'items',
							list: 'list',
							children: 'children',
						},
						groups: ['unknown', 'items', 'list', 'children'],
						ignorePattern: ['children'],
						order: 'asc',
						type: 'natural',
					},
				],
			},
		},
	];
}
