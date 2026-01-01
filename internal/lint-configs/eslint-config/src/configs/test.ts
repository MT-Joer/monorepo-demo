/*
  eslint-config/src/configs/test.ts

  说明：测试文件专属规则（vitest 与 no-only-tests）以规范测试编写与运行。
  要点：
  - 限制匹配 __tests__、*.spec、*.test 等模式的文件
  - 禁止 console.log 的限制被放宽以便调试
  - 禁止测试中的 .only 以防止提交未完成的定向测试
*/

import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function test(): Promise<Linter.Config[]> {
	const [pluginTest, pluginNoOnlyTests] = await Promise.all([
		interopDefault(import('eslint-plugin-vitest')),
		// @ts-expect-error - no types
		interopDefault(import('eslint-plugin-no-only-tests')),
	] as const);

	return [
		{
			files: [
				`**/__tests__/**/*.?([cm])[jt]s?(x)`,
				`**/*.spec.?([cm])[jt]s?(x)`,
				`**/*.test.?([cm])[jt]s?(x)`,
				`**/*.bench.?([cm])[jt]s?(x)`,
				`**/*.benchmark.?([cm])[jt]s?(x)`,
			],
			plugins: {
				test: {
					...pluginTest,
					rules: {
						...pluginTest.rules,
						...pluginNoOnlyTests.rules,
					},
				},
			},
			rules: {
				'no-console': 'off',
				'node/prefer-global/process': 'off',
				'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
				'test/no-identical-title': 'error',
				'test/no-import-node-test': 'error',
				'test/no-only-tests': 'error',
				'test/prefer-hooks-in-order': 'error',
				'test/prefer-lowercase-title': 'error',
			},
		},
	];
}
