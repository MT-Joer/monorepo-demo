/*
  eslint-config/src/configs/node.ts

  说明：Node.js 环境规则（eslint-plugin-n），用于检查后端代码和脚本。
  要点：
  - 限制全局 buffer/process 使用以鼓励更显式的导入
  - 在脚本和内部目录中放宽 process 限制
  - 白名单化某些允许的外部 import（如 vitest, vite 等开发工具）
*/

import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function node(): Promise<Linter.Config[]> {
	const pluginNode = await interopDefault(import('eslint-plugin-n'));

	return [
		{
			plugins: {
				n: pluginNode,
			},
			rules: {
				'n/handle-callback-err': ['error', '^(err|error)$'],
				'n/no-deprecated-api': 'error',
				'n/no-exports-assign': 'error',
				'n/no-extraneous-import': [
					'error',
					{
						allowModules: [
							'unbuild',
							'@vben/vite-config',
							'vitest',
							'vite',
							'@vue/test-utils',
							'@vben/tailwind-config',
							'@playwright/test',
						],
					},
				],
				'n/no-new-require': 'error',
				'n/no-path-concat': 'error',
				// 'n/no-unpublished-import': 'off',
				'n/no-unsupported-features/es-syntax': [
					'error',
					{
						ignores: [],
						version: '>=20.12.0',
					},
				],
				'n/prefer-global/buffer': ['error', 'never'],
				// 'n/no-missing-import': 'off',
				'n/prefer-global/process': ['error', 'never'],
				'n/process-exit-as-throw': 'error',
			},
		},
		{
			files: [
				'scripts/**/*.?([cm])[jt]s?(x)',
				'internal/**/*.?([cm])[jt]s?(x)',
			],
			rules: {
				'n/prefer-global/process': 'off',
			},
		},
	];
}
